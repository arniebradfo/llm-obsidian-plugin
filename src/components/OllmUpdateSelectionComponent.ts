import { ButtonComponent } from "obsidian";
import { MarkdownRendererComponent } from "src/components/MarkdownRendererComponent";
import { Editor } from "obsidian";
import { App, Component } from "obsidian";
import ollama from "ollama";

export class OllmUpdateSelectionComponent extends Component {
	containerEl: HTMLElement;
	app: App;
	editor: Editor;
	selectionText: string;

	rewriteButtonEl: ButtonComponent;
	applyButtonEl: ButtonComponent;
	markdownRendererEl: MarkdownRendererComponent;

	constructor(containerEl: HTMLElement, app: App, editor: Editor) {
		super();
		this.containerEl = containerEl;
		this.app = app;
		this.editor = editor;
		this.selectionText = editor.getSelection();
	}

	onload() {
		console.log("onload");
		this.initializeUI();
	}

	initializeUI() {
		const { containerEl } = this;
		const inputContainerEl = containerEl.createEl("div", {
			cls: "ollm-modal-input-container",
		});

		// const textareaEl = new TextAreaComponent(inputContainerEl).setPlaceholder('What do you want to change?');
		// const inputEl = new TextComponent(inputContainerEl).setPlaceholder('What do you want to change?');
		// const submitButtonEl = new ButtonComponent(inputContainerEl).setButtonText('Submit').setCta()

		this.rewriteButtonEl = new ButtonComponent(inputContainerEl)
			.setButtonText("Rewrite")
			.onClick(async () => {
				await this.runRewrite();
			});

		this.applyButtonEl = new ButtonComponent(inputContainerEl)
			.setButtonText("Apply")
			.setDisabled(true)
			.onClick(() => {
				this.applyRewrite();
			});

		const hr = containerEl.createEl("hr");

		const outputContainerEl = containerEl.createEl("div", {
			cls: "ollm-modal-output-container",
		});

		this.markdownRendererEl = new MarkdownRendererComponent(
			outputContainerEl,
			this.app,
			this.selectionText || "No selection text"
		);
	}

	async runRewrite() {
		const rewritePrompt = `Please rewrite the following text improved clarity and readability. The reply should include only the rewritten text, no other text. \n\n---\n\n${this.selectionText}`;

		const response = await ollama.chat({
			model: "llama3.2:latest",
			messages: [{ role: "user", content: rewritePrompt }],
			stream: true,
		});

		this.markdownRendererEl.empty();
		
		for await (const part of response) {
			console.log(part.message.content);
			this.markdownRendererEl.appendMarkdownText(part.message.content);
		}
		this.applyButtonEl.setDisabled(false).setCta();

		console.log(this.markdownRendererEl.markdown);
	}

	applyRewrite() {
		this.editor.replaceSelection(this.markdownRendererEl.markdown);
		this.unload();
	}

	onunload() {
		console.log("onunload");
		this.containerEl.empty();
		ollama.abort();
	}
}
