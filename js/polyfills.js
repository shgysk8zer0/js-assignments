import {$} from './std-js/functions.js';

if (! (document.createElement('dialog') instanceof HTMLDialogElement)) {
	Object.defineProperty(HTMLElement.prototype, 'open', {
		get: function() {
			return !! this.hasAttribute('open');
		},
		set: function(val) {
			if (val) {
				this.setAttribute('open', null);
			} else {
				this.removeAttribute('open');
			}
		}
	});
	HTMLElement.prototype.show = function() {
		this.open = true;
	};
	HTMLElement.prototype.showModal = function() {
		this.open = true;
		this.classList.add('modal');
	};
	HTMLElement.prototype.close = function() {
		this.open = false;
		this.classList.remove('modal');
	};
}

if (! (document.createElement('details') instanceof HTMLDetailsElement)) {
	if (! ('open' in HTMLElement.prototype)) {
		Object.defineProperty(HTMLElement.prototype, 'open', {
			get: function() {
				return !! this.hasAttribute('open');
			},
			set: function(val) {
				if (val) {
					this.setAttribute('open', null);
				} else {
					this.removeAttribute('open');
				}
			}
		});
	}
	$(window).load(() => {
		$('details > summary').click(toggleParentOpen);

		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(node => {
						$('details > summary', node).click(toggleParentOpen);
					});
				}
			});
		});
		observer.observe(document.body, {
			childList: true
		});
	});
}

function toggleParentOpen() {
	this.parentElement.open = ! this.parentElement.open;
}
