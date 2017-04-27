import {$} from './std-js/functions.js';
import './polyfills.js';

$(window).load(() => {
	$('[data-import]').each(importHTML);

	if (location.pathname === '/') {
		listAssignments(
			new URL('lessons.json', document.baseURI),
			document.getElementById('lesson-template'),
			document.querySelector('main > ol')
		);
	}
});

function importHTML(node) {
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

function listAssignments(url, template, list) {
	fetch(url).then(resp => {
		if (resp.ok) {
			return resp.json();
		} else {
			throw new Error(`${resp.url} [${resp.status}: ${resp.statusText}]`);
		}
	}).then(json => {
		setTimeout(() => {
			json.forEach(lesson => {
				let container = template.cloneNode(true).content;
				container = document.importNode(container, true);
				container.querySelectorAll('[data-prop]').forEach(node => {
					if (node.dataset.prop in lesson) {
						if (node.dataset.hasOwnProperty('attr')) {
							node.setAttribute(node.dataset.attr, lesson[node.dataset.prop]);
						} else {
							node.textContent = lesson[node.dataset.prop];
						}
					} else {
						node.remove();
					}
				});
				list.appendChild(container);
			});
		}, 1000);

	}).catch(console.error);
}
