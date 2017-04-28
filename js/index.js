import {$} from './std-js/functions.js';
import * as mutations from './mutations.js';
import * as handlers from './dataHandlers.js';
import './polyfills.js';

$(window).ready(() => init()).load(() => {
	$(document.body).watch(mutations.events, mutations.options, mutations.filter);
	if (location.pathname === '/') {
		listAssignments(
			new URL('lessons.json', document.baseURI),
			document.getElementById('lesson-template'),
			document.querySelector('main > ol')
		);
	}
});

export function init(rootNode = document.body) {
	$('[data-import]', rootNode).each(handlers.importHTML);
	$('[data-show-modal]', rootNode).click(handlers.showModal);
	$('[data-show]', rootNode).click(handlers.show);
	$('[data-close]', rootNode).click(handlers.close);
	$('[data-remove]', rootNode).click(handlers.remove);
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
