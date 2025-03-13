import { Component, App, MarkdownRenderer } from "obsidian";

export class MarkdownRendererComponent extends Component {
	containerEl: HTMLElement;
	app: App;
	markdown: string;
	markdownEl: HTMLElement;
	constructor(containerEl: HTMLElement, app: App, markdown: string) {
		super();
		this.containerEl = containerEl;
		this.app = app;
		this.markdown = markdown;
		this.load(); // self loading
	}
	onload() {
		this.markdownEl = this.containerEl.createEl("div", {
			cls: "markdown-renderer",
		});
		this.render();
	}
	setMarkdownText(markdown: string) {
		this.markdown = markdown;
		this.render();
	}
	appendMarkdownText(markdown: string) {
		this.markdown += markdown;
		this.render();
	}
	render() {
		this.markdownEl.empty();
		MarkdownRenderer.render(
			this.app,
			this.markdown,
			this.markdownEl,
			"",
			this
		);
	}
	onunload() {
		this.empty();
	}
	empty() {
		this.markdownEl.empty();
		this.markdown = "";
	}
}
