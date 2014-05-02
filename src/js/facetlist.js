$.widget('upcycle.facetlist', {
	'options': {
		
	},
	'_create': function(){

	},
	'_render': function(){

	},
	'_getMarkup': function(facets){
		var template = eval(this.options.templatesNamespace)['facetlist']
		return template(this.options.facets);
	}
});


/*


facetlist.set(facets);
facetlist.add(facets);
facetlist.remove(facets);


 */