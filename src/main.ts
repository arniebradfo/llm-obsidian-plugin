import { Editor, MarkdownView, Modal, Notice, Plugin } from "obsidian";
import {
	OllmPluginSettings,
	OLLM_DEFAULT_SETTINGS,
} from "src/settings/OllmPluginSettings";
import { OllmPluginSettingTab } from "./settings/OllmPluginSettingTab";
import { OllmUpdateSelectionComponent } from "src/components/OllmUpdateSelectionComponent";

export default class OllmPlugin extends Plugin {
	settings: OllmPluginSettings;

	async onload() {
		await this.loadSettings();

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
		this.addSettingTab(new OllmPluginSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			OLLM_DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
