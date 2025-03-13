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
	markdownRendererEl: MarkdownRendererComponent;
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

		const outputContainerEl = contentEl.createEl("div", {
			cls: "ollm-chat-view-output-container",
		});
		this.markdownRendererEl = new MarkdownRendererComponent(
			outputContainerEl,
			this.app,
			""
		);

		const promptContainerEl = contentEl.createEl("div", {
			cls: "ollm-chat-view-prompt-container",
		});

		this.textareaEl = new TextAreaComponent(promptContainerEl)
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

	async runLlm() {
		const prompt = this.textareaEl.getValue();

		if (prompt.length === 0) {
			return;
		}

		this.chatHistory.push({ role: "user", content: prompt });

		this.markdownRendererEl.appendMarkdownText(
			`${roleBreak}> [!user]\n\n${prompt}${roleBreak}`
		);

		this.textareaEl.setValue("");
		console.log(prompt);

		const response = await ollama.chat({
			model: "llama3.2:latest",
			messages: this.chatHistory,
			stream: true,
		});

    let content = ""
		for await (const part of response) {
			console.log(part.message.content);
			content += part.message.content;
			this.markdownRendererEl.appendMarkdownText(part.message.content);
		}

		this.chatHistory.push({
			role: "assistant",
			content,
		});
	}

	async onClose() {
		// Nothing to clean up.
	}
}

const roleBreak = `\n\n---\n\n`;
