$.widget('upcycle.facetlist', {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'facets': [],
		'localizeLabels': true,
		'label': 'FACETLIST_LABEL'
	},
	'_create': function(){
		this._on({'click [role="button"][data-action="remove"]': this._onRemove});
		this.element.addClass('up-facetlist');
		this._render();
	},
	'_render': function(){
		this.element
			.empty()
			.html(this._getMarkup());
		return this;
	},
	'remove': function(name, option){
		this.options.facets = _(this.options.facets).reject(function(facet){
			if(facet.name === name){
				facet.options = _(facet.options).without(option); 
			}
			return !facet.options.length;
		});
		return this._render();
	},
	'_setOption': function(key, value){
		$.Widget.prototype._setOption.call(this, key, value);
		if(key === 'facets'){
			this._render();
		}
	},
	'_onRemove': function(event){
		var $item = $(event.currentTarget).parent(),
			name = $item.attr('data-facet'),
			option = $item.attr('data-facet-option');
		return this.remove(name, option);
	},
	'_getMarkup': function(){
		var template = eval(this.options.templatesNamespace)['facetlist'];
		return template(this._getTemplateContext(this.options));
	},
	'_getTemplateContext': function(options){
		var context = _({}).extend(options);
		if(this.options.localizeLabels){
			_(context).extend({
				'label': $.i18n.prop(options.label)
			});
		}
		return context;
	}
});


/*


facetlist.set(facets);
facetlist.add(facets);
facetlist.remove(facets);


 */