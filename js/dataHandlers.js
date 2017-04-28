import {$} from './std-js/functions.js';

export function remove(event) {
	event.stopPropagation();
	$(this.dataset.remove).remove();
}

export function close(event) {
	event.stopPropagation();
	document.querySelector(this.dataset.close).close();
}

export function show(event) {
	event.stopPropagation();
	document.querySelector(this.dataset.show).show();
}

export function showModal(event) {
	event.stopPropagation();
	document.querySelector(this.dataset.showModal).showModal();
}

export function importHTML(node) {
	let link = document.querySelector(`link[rel="import"][name="${node.dataset.import}"]`);

	if (sessionStorage.hasOwnProperty(`import-${link.getAttribute('name')}`)) {
		appendImport(sessionStorage.getItem(`import-${link.getAttribute('name')}`), node);
	} else {
		fetch(link.href, {cache: 'default'}).then(resp => {
			if (resp.ok) {
				return resp.text();
			} else {
				throw new Error(`${resp.url} [${resp.status}: ${resp.statusText}]`);
			}
		}).then(html => {
			sessionStorage.setItem(`import-${link.getAttribute('name')}`, html);
			appendImport(html, node);
		}).catch(console.error);
	}
}

function appendImport(html, node) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	doc.body.childNodes.forEach(child => {
		node.appendChild(node.ownerDocument.importNode(child, true));
	});
}
