const hideMetaClassName = "meta-editor-hide-meta-yaml";

export function isHideMetaYaml() {
	return document.body.classList.contains(hideMetaClassName);
}

export function showMetaYaml() {
	document.body.classList.remove(hideMetaClassName);
}

export function hideMetaYaml() {
	document.body.classList.remove(hideMetaClassName);
}
