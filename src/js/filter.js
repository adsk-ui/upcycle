$.widget('upcycle.filter', {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'label': 'Filters',
		'clearAllLabel': 'Clear all',
		'resultsLabel': 'Results',
		'data': {}
	},
	'_create': function(){
		this._on({'click [data-action="clear-all"]': this.clear});
		this.element.addClass('filter');
		this._render();
	},
	/**
	 * Clears all checkboxes (deselects all filters)		
	 * @return {jQuery} A jQuery object containing the element associated to this widget
	 */
	'clear': function(){
		this.element.find('[type="checkbox"]').each(function(index, checkbox){
			checkbox.checked = false;
		});
		return this.element;
	},
	'_render': function(){
		this.facetlist = this.element
			.empty()
			.append(this._getMarkup())
			.find('.facetlist')
				.facetlist({
					'data': this.options.data
				})
				.data('upcycle-facetlist');
		this.update();
	},
	'update': function(){
		this.facetlist.update();
	},
	'_getMarkup': function(){
		var filterMarkup = this._getTemplate('filter')(this.options);
		return filterMarkup;
	},
	'_getTemplate': function(name){
		return eval(this.options.templatesNamespace)[name];
	}
});