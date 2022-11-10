import { Plugin } from "obsidian";
import { hideMetaYaml, isHideMetaYaml, showMetaYaml } from "./utils";

export default class ToggleMetaYamlPlugin extends Plugin {
	async onload() {
		console.log(`load ToggleMetaYaml`);

		this.addCommand({
			id: "obsidian-toggle-meta-yaml-toggle",
			name: "toggle",
			editorCallback: () => {
				if (isHideMetaYaml()) {
					showMetaYaml();
				} else {
					hideMetaYaml();
				}
			},
		});
	}

	onunload() {
		showMetaYaml();
	}
}
