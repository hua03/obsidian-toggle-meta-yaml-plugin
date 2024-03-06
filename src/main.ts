import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting } from "obsidian";
import { Prec } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { hideMetaYaml, showMetaYaml } from "./show-hide";

interface PluginSettings {
	show: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
	show: true,
};

export default class ToggleMetaYamlPlugin extends Plugin {
	settings: PluginSettings;

	async onload() {
		console.log(`Loading Toggle Meta YAML Plugin`);
		await this.loadSettings();
		this.addSettingTab(new ToggleMetaYamlSettingTab(this.app, this));

		this.addCommand({
			id: "obsidian-toggle-meta-yaml-toggle",
			name: "Toggle",
			editorCallback: () => {
				this.settings.show = !this.settings.show;
				this.refreshView();
			},
		});

		this.registerEditorExtension([
			Prec.highest(EditorView.domEventHandlers({
				"keyup": this.onKeyup
			}))
		]);
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
		this.refreshView();
	}

	async reset() {
		this.settings = { ...DEFAULT_SETTINGS };
		await this.saveSettings();
	}

	refreshView() {
		if (this.settings.show) {
			showMetaYaml();
		} else {
			hideMetaYaml();
		}
	}

	private readonly onKeyup = (event: KeyboardEvent, view: EditorView) => {
		// 获取光标位置
		const cursor = view.state.selection.asSingle().main;
		const metaRange = this.getRangeOfMetaYaml(view)
		const editor = this.getEditor()

		// 起始位置和结束位置一致，说明没有yaml
		if (metaRange.to === metaRange.from) return

		if (event.key === 'ArrowDown') {
			if (cursor.from <= metaRange.from) {
				editor?.setCursor(metaRange.lineEnd + 1)
			}
		}
	}

	getRangeOfMetaYaml(view: EditorView) {
		const editor = this.getEditor()
		const range = { from: 0, to: 0, lineEnd: 0, lineStart: 0 }


		if (editor) {
			const lineCount = editor.lineCount()
			const docs = []
			const metaYaml = []
			const metaYamlBoundaryMatch = /^-{3}$/

			for (let i = 0; i < lineCount; i++) {
				const string = editor.getLine(i)
				// 是否存在起始标识
				const hasStart = metaYaml.filter(v => string.match(metaYamlBoundaryMatch)).length === 1
				// 是否存在结束标识
				const hasEnd = metaYaml.filter(v => string.match(metaYamlBoundaryMatch)).length === 2

				if (string.match(metaYamlBoundaryMatch)) {
					// 存入起始标识
					if (!metaYaml.length) {
						const start = docs.join('').length + 1
						range.from = start
						range.lineStart = docs.length + 1
						metaYaml.push(string)
						// 存入结束标识
					} else if (!hasEnd) {
						metaYaml.push(string)
						const end = range.from + metaYaml.join('').length
						range.to = end
						range.lineEnd = metaYaml.length + docs.length
					} else {
						docs.push(string)
					}
				} else {
					if (hasStart && !hasEnd) {
						metaYaml.push(string)
					} else {
						docs.push(string)
					}
				}
			}
		}

		return range
	}

	getEditor = (): Editor | null => {
		let editor = null;
		let markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (markdownView) {
			editor = markdownView.editor;
		}
		if (editor === null) console.error('Can\'t get editor');
		return editor;
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
		containerEl.createEl("h2", { text: "Toggle Meta YAML Settings" });
		new Setting(containerEl)
			.setName("Show meta YAML and in-document properties")
			.setDesc(
				"If disabled, markdown meta YAML and in-document properties will be hidden."
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


