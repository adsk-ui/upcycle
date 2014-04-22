$.widget('Upcycle.filter', {
	'options': {
		'templatesNamespace': 'Upcycle.templates',
		'label': 'Filters',
		'clearAllLabel': 'Clear all',
		'resultsLabel': 'Results',
		'facets': {}
	},
	'_create': function(){
		this.element.addClass('filter');
		this._render();
	},
	'_render': function(){
		this.element
			.empty()
			.append(this._getMarkup());
	},
	'_getMarkup': function(){
		var facetListTemplate = eval(this.options.templatesNamespace)['facetlist'],
			facetListMarkup = facetListTemplate(this.options.facets);
			
		return facetListMarkup;
	},
	'_getTemplateContext': function(data){
		return this.options;
	}
});