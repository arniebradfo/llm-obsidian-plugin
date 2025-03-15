import {
	ItemView,
	WorkspaceLeaf,
	TextAreaComponent,
	ButtonComponent,
	Scope,
} from "obsidian";
import ollama, { Message, ToolCall } from "ollama";
import { MarkdownRendererComponent } from "src/components/MarkdownRendererComponent";
import { dateTimeTool, handleDateTimeTool } from "src/tools/dateTimeTool";

export const VIEW_TYPE_CHAT = "ollm-chat";

export class ChatView extends ItemView {
	textareaEl: TextAreaComponent;
	submitButton: ButtonComponent;
	outputContainerEl: HTMLElement;
	chatHistory: Message[] = [];

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_CHAT;
	}

	getDisplayText() {
		return "OLLM Chat";
	}

	async onOpen() {
		const { contentEl } = this;

		contentEl.empty();

		this.outputContainerEl = contentEl.createEl("div", {
			cls: "ollm-chat-view-output-container",
		});

		const promptContainerEl = contentEl.createEl("div", {
			cls: "ollm-chat-view-prompt-container",
		});

		this.textareaEl = new TextAreaComponent(promptContainerEl);
		this.textareaEl.inputEl.focus();

		this.scope = new Scope();
		this.scope.register(["Mod"], "Enter", () => {
			this.chat();
		});

		this.submitButton = new ButtonComponent(promptContainerEl)
			.setIcon("send")
			.onClick(() => {
				this.chat();
			});
	}

	createMessageRenderer(message: Message): MarkdownRendererComponent {
		const messageEl = this.outputContainerEl.createEl("div", {
			cls: `ollm-chat-message ollm-chat-message-${message.role}`,
		});

		return new MarkdownRendererComponent(
			messageEl,
			this.app,
			message.content
		);
	}

	async chat() {
		const prompt = this.textareaEl.getValue();

		if (prompt.length === 0) {
			return;
		}

		const userMessage: Message = { role: "user", content: prompt };
		this.chatHistory.push(userMessage);
		this.createMessageRenderer(userMessage);

		this.textareaEl.setValue("");
		console.log(prompt);

		const response = await ollama.chat({
			model,
			messages: this.chatHistory,
			stream: true,
			tools: [dateTimeTool],
		});

		const assistantMessage: Message = { role: "assistant", content: "" };
		const assistantRenderer = this.createMessageRenderer(assistantMessage);

		for await (const part of response) {
			console.log(part.message);

			if (part.message.tool_calls && part.message.tool_calls.length > 0) {
				for (const toolCall of part.message.tool_calls) {
					if (assistantMessage.tool_calls) {
						assistantMessage.tool_calls.push(toolCall);
					} else {
						assistantMessage.tool_calls = [toolCall];
					}
				}
			}

			assistantMessage.content += part.message.content;
			assistantRenderer.setMarkdownText(assistantMessage.content);
		}

		this.chatHistory.push(assistantMessage);

		if (assistantMessage.tool_calls) {
			for (const toolCall of assistantMessage.tool_calls) {
				this.toolCall(toolCall);
			}
		}
	}

	async toolCall(toolCall: ToolCall) {
		// if result does not get set, provide an error message to the llm
		let result = "Error handling tool call";
		if (toolCall.function.name === "get_current_datetime") {
			try {
				const args =
					typeof toolCall.function.arguments === "string"
						? JSON.parse(toolCall.function.arguments)
						: toolCall.function.arguments;
				result = await handleDateTimeTool(args);
			} catch (error) {
				console.error("Error handling datetime tool:", error);
			}
		}

		const toolMessage: Message = {
			role: "tool",
			content: result,
			// tool_call_id: toolCall.id,
		};

		this.chatHistory.push(toolMessage);
		
		const response = await ollama.chat({
			model,
			messages: this.chatHistory,
			stream: true,
			tools: [dateTimeTool],
		});

		const assistantMessage: Message = { role: "assistant", content: "" };
		const assistantRenderer = this.createMessageRenderer(assistantMessage);

		for await (const part of response) {
			console.log(part.message);

			assistantMessage.content += part.message.content;
			assistantRenderer.setMarkdownText(assistantMessage.content);
		}

		this.chatHistory.push(assistantMessage);
	}

	async onClose() {
		// Nothing to clean up.
	}
}

const model = "llama3.2:latest"; // Temporary
