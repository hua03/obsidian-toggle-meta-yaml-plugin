import { Plugin } from "obsidian";
import { hideMetaYaml, isHideMetaYaml, showMetaYaml } from "./utils";

export default class ToggleMetaYaml extends Plugin {
	async onload() {
		console.log(`load MetaEditor`);

		this.addCommand({
			id: "obsidian-toggle-meta-yaml",
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
}
