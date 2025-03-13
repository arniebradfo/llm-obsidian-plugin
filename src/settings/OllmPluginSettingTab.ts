import { PluginSettingTab, App, Setting } from "obsidian";
import OllmPlugin from "src/main";

export class OllmPluginSettingTab extends PluginSettingTab {
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
