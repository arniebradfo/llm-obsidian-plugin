import { Plugin } from "obsidian";
import {
	OllmPluginSettings,
	OLLM_DEFAULT_SETTINGS,
} from "src/settings/OllmPluginSettings";
import { OllmPluginSettingTab } from "./settings/OllmPluginSettingTab";
import { rewriteSectionCommand } from "./commands/RewriteSectionCommand";

export default class OllmPlugin extends Plugin {
	settings: OllmPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addCommand(rewriteSectionCommand(this));
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
