import {
	ItemView,
	WorkspaceLeaf,
	TextAreaComponent,
	ButtonComponent,
  Scope,
} from "obsidian";
import ollama from "ollama";
import { MarkdownRendererComponent } from "src/components/MarkdownRendererComponent";

export const VIEW_TYPE_CHAT = "ollm-chat";

export class ChatView extends ItemView {
	textareaEl: TextAreaComponent;
	submitButton: ButtonComponent;
	markdownRendererEl: MarkdownRendererComponent;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_CHAT;
	}

	getDisplayText() {
		return "Chat";
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

		this.textareaEl = new TextAreaComponent(promptContainerEl);
    this.scope = new Scope()
    this.scope.register(
      ["Mod"],
      "Enter",
      () => {
        console.log("Enter");
        if (this.textareaEl.getValue().length > 0) {
          this.runLlm();
        }
      }
    );

		this.submitButton = new ButtonComponent(promptContainerEl)
			.setIcon("send")
			.onClick(() => {
        if (this.textareaEl.getValue().length > 0) {
          this.runLlm();
        }
			});
	}

	async runLlm() {
		const prompt = this.textareaEl.getValue();

    this.markdownRendererEl.appendMarkdownText(`${roleBreak}> [!user]\n> ${prompt}${roleBreak}`);

		this.textareaEl.setValue("");
		console.log(prompt);

		const response = await ollama.chat({
			model: "llama3.2:latest",
			messages: [{ role: "user", content: prompt }],
			stream: true,
		});

		for await (const part of response) {
			console.log(part.message.content);
			this.markdownRendererEl.appendMarkdownText(part.message.content);
		}


	}

	async onClose() {
		// Nothing to clean up.
	}
}

const roleBreak = `\n\n`;
