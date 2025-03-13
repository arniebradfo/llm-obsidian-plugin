import {
	App,
	ButtonComponent,
	Editor,
	MarkdownRenderer,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	Component,
} from "obsidian";
import ollama from "ollama";

interface OllmPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: OllmPluginSettings = {
	mySetting: "default",
};

export default class OllmPlugin extends Plugin {
	settings: OllmPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "ollm-rewrite-selection",
			name: "Rewrite Selection",
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());

				const modal = new Modal(this.app);

				const ollmUpdateSelectionComponent =
					new OllmUpdateSelectionComponent(
						modal.contentEl,
						this.app,
						editor
					);
				ollmUpdateSelectionComponent.load();
				modal.onClose = () => {
					// is this necessary for unloading? or preventing memory leaks?
					ollmUpdateSelectionComponent.unload();
					modal.contentEl.empty();
				};
				
				ollmUpdateSelectionComponent.register(() => {
					modal.close();
				});
				
				modal.open();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class MarkdownRendererComponent extends Component {
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

class OllmUpdateSelectionComponent extends Component {
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
		const rewritePrompt = `Please rewrite the following text for a 10 year old. The reply should include only the rewritten text, no other text. \n\n---\n\n${this.selectionText}`;

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

class SampleSettingTab extends PluginSettingTab {
	plugin: OllmPlugin;

	constructor(app: App, plugin: OllmPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
