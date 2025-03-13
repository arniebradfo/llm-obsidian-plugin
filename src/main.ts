import { Plugin, WorkspaceLeaf } from "obsidian";
import {
	OllmPluginSettings,
	OLLM_DEFAULT_SETTINGS,
} from "src/settings/OllmPluginSettings";
import { OllmPluginSettingTab } from "./settings/OllmPluginSettingTab";
import { rewriteSectionCommand } from "./commands/RewriteSectionCommand";
import { VIEW_TYPE_CHAT } from "./views/ChatView";
import { ChatView } from "./views/ChatView";

export default class OllmPlugin extends Plugin {
	settings: OllmPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addCommand(rewriteSectionCommand(this));
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new OllmPluginSettingTab(this.app, this));

		this.registerView(VIEW_TYPE_CHAT, (leaf) => new ChatView(leaf));

		this.addRibbonIcon("dice", "Activate view", () => {
			this.activateView();
		});
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_CHAT);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: VIEW_TYPE_CHAT, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		if (leaf) {
			workspace.revealLeaf(leaf);
		}
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
