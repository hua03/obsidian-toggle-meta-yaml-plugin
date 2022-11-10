const hideMetaClassName = "toggle-meta-yaml--hide";

export function isHideMetaYaml() {
	return document.body.classList.contains(hideMetaClassName);
}

export function showMetaYaml() {
	document.body.classList.remove(hideMetaClassName);
}

export function hideMetaYaml() {
	document.body.classList.add(hideMetaClassName);
}
