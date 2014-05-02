$.widget('upcycle.facetlist', {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'facets': [],
		'localizeLabels': true,
		'label': 'FACETLIST_LABEL'
	},
	'_create': function(){
		this._on({'click [role="button"][data-action="remove"]': this._onRemove});
		// this.element.addClass('up-facetlist');
		this._render();
	},
	'_render': function(){
		this.element.html(this._getMarkup());
		return this;
	},
	'add': function(facetsToAdd){
		var facets = this.options.facets;
		facetsToAdd = _.isArray(facetsToAdd) ? facetsToAdd : _.isObject(facetsToAdd) ? [facetsToAdd] : [];
		
		_(facetsToAdd).each(function(facetToAdd){
			var existing = _(facets).findWhere({'name': facetToAdd.name});
			if(existing){
				existing.options = _(existing.options.concat(facetToAdd.options)).uniq();
			}else{
				facets.push(facetToAdd);
			}
		}, this);
		return this._setOption('facets', facets);
	},
	'remove': function(facetsToRemove){
		facetsToRemove = _.isArray(facetsToRemove) ? facetsToRemove : _.isObject(facetsToRemove) ? [facetsToRemove] : [];
		var facets = _(this.options.facets).reject(function(facet){
			var remove = _(facetsToRemove).findWhere({'name': facet.name});
			if(remove){
				facet.options = _(facet.options).difference(remove.options);
			}
			return !facet.options.length;
		}, this);
		this._trigger('remove', null, {
			'removedFacets': facetsToRemove
		});
		return this._setOption('facets', facets);
			
	},
	'reset': function(){
		return this._setOption('facets', []);
	},
	'_setOption': function(key, value){
		this._super(key, value);
		if(key === 'facets'){
			this._render();
			this._trigger('change', null, {
				'facets': this.options.facets
			});
		}
		return this;
	},
	'_onRemove': function(event){
		var $item = $(event.currentTarget).parent(),
			name = $item.attr('data-facet'),
			option = $item.attr('data-facet-option');
		return this.remove({
			'name': name,
			'options': [option]
		});
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