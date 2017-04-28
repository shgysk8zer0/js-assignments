import {$} from './std-js/functions.js';
import * as handlers from './dataHandlers.js';
import {init} from './index.js';

export const events = {
	attributes: function() {
		switch(this.attributeName) {
			case 'data-remove':
				if (this.target.dataset.hasOwnProperty('remove')) {
					this.target.addEventListener('click', handlers.remove);
				} else {
					this.target.removeEventListener('click', handlers.remove);
				}
				break;
			case 'data-show-modal':
				if (this.target.dataset.hasOwnProperty('showModal')) {
					this.target.addEventListener('click', handlers.showModal);
				} else {
					this.target.removeEventListener('click', handlers.showModal);
				}
				break;
			case 'data-show':
				if (this.target.dataset.hasOwnProperty('show')) {
					this.target.addEventListener('click', handlers.show);
				} else{
					this.target.removeEventListener('click', handlers.show);
				}
				break;
			case 'data-close':
				if (this.target.dataset.hasOwnProperty('close')) {
					this.target.addEventListener('click', handlers.close);
				} else {
					this.target.removeEventListener('click', handlers.close);
				}
				break;
			case 'open':
				break;
			default:
				throw new Error(`Unhandled attribute change [${this.attributeName}]`);

		}
	},
	childList: function() {
		$(this.addedNodes).each(node => {
			if (node.nodeType === 1) {
				init(node);
			}
		});
	}
};
export const filter = [
	'data-remove',
	'data-show-modal',
	'data-show',
	'data-close',
	'open'
];

export const options = [
	'subtree',
	'attributeOldValue'
];
