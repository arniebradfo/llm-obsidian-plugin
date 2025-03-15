import {
	ItemView,
	WorkspaceLeaf,
	TextAreaComponent,
	ButtonComponent,
	Scope,
} from "obsidian";
import ollama, { Message } from "ollama";
import { MarkdownRendererComponent } from "src/components/MarkdownRendererComponent";

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
			this.runLlm();
		});

		this.submitButton = new ButtonComponent(promptContainerEl)
			.setIcon("send")
			.onClick(() => {
				this.runLlm();
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

	async runLlm() {
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
			model: "llama3.2:latest",
			messages: this.chatHistory,
			stream: true,
		});

		const assistantMessage: Message = { role: "assistant", content: "" };
		const assistantRenderer = this.createMessageRenderer(assistantMessage);

		for await (const part of response) {
			console.log(part.message.content);
			assistantMessage.content += part.message.content;
			assistantRenderer.setMarkdownText(assistantMessage.content);
		}

		this.chatHistory.push(assistantMessage);
	}

	async onClose() {
		// Nothing to clean up.
	}
}