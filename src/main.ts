import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { hideMetaYaml, showMetaYaml } from "./utils";

interface PluginSettings {
	show: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
	show: true,
};

export default class ToggleMetaYamlPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		console.log(`load ToggleMetaYaml Plugin`);
		await this.loadSettings();
		this.addSettingTab(new ToggleMetaYamlSettingTab(this.app, this));

		this.addCommand({
			id: "obsidian-toggle-meta-yaml-toggle",
			name: "toggle",
			editorCallback: () => {
				this.settings.show = !this.settings.show;
				this.toggleMetaYaml();
			},
		});
	}

	onunload() {
		this.reset();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		await this.saveSettings();
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.toggleMetaYaml();
	}

	async reset() {
		this.settings = { ...DEFAULT_SETTINGS };
		await this.saveSettings();
	}

	toggleMetaYaml() {
		if (this.settings.show) {
			showMetaYaml();
		} else {
			hideMetaYaml();
		}
	}
}

class ToggleMetaYamlSettingTab extends PluginSettingTab {
	plugin: ToggleMetaYamlPlugin;

	constructor(app: App, plugin: ToggleMetaYamlPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Toggle Meta Yaml Settings" });
		new Setting(containerEl)
			.setName("Show Meta Yaml")
			.setDesc(
				"If disable, markdown meta yaml will be hidden. It only work at live preview mode, preview mode don't support currently. " +
					"Source mode don't need it."
			)
			.addToggle((component) =>
				component
					.setValue(this.plugin.settings.show)
					.onChange(async (value) => {
						this.plugin.settings.show = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
