$.widget('upcycle.filter', {
	'defaultElement': '<div>',
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'localizeLabels': true,
		'label': 'FILTER_FILTER',
		'clearAllLabel': 'FILTER_CLEAR_ALL',
		'resultsLabel': 'FILTER_RESULTS',
		'resultLabel': 'FILTER_RESULT',
		'data': [],
		'facets': [],
		'selectedFacets': [],
		'searchQuery': '',
		'eventDelay': 0
	},
	'_create': function(){
		this._setOptions(this.options);
		this._on({'click [data-action="clear-all"]': this.clear});
		this._on({'selectlistchange': this._onFilterChange});
		this.element.addClass('up-filter');
		this._render();
	},
	/**
	 * Clears all checkboxes (deselects all filters)		
	 * @return {jQuery} A jQuery object containing the element associated to this widget
	 */
	'clear': function(){
		this.element.find('[type="checkbox"]').each(function(index, checkbox){
			checkbox.checked = false;
		}).trigger('change');
		return this.element;
	},
	'update': function(){
		this.selectlist.update();
	},
	'search': function(query){

	},
	'_onSearch': function(event){

	},
	'_onFilterChange': function(event, data){
		event.stopPropagation();
		this.option('selectedFacets', data.selectedFacets);
		this._triggerChangeEvent(event);
	},
	'_triggerChangeEvent': function(event){
		var filteredData = [],
			selectedFacets = this.options.selectedFacets;
		if(!_.isEmpty(this.options.data)){
			filteredData = _(this.options.data)
				.chain()
				.filter(function(obj){
					return _(selectedFacets).every(function(values, facetName){
						return _(values).some(function(value){
							return obj[facetName] === value;
						});
					});
				})
				.value();
		}
		this.option('filteredDataLength', filteredData.length);
		this._trigger('change', event, {
			'selectedFacets': this.options.selectedFacets,
			'filteredData': filteredData
		});
	},
	'_setOption': function(key, value){
		$.Widget.prototype._setOption.call(this, key, value);
		if(key === 'data' || key === 'facets'){
			_(this.options.facets).each(function(f){
				var facetOptions = _(this.options.data)
					.chain()
					.pluck(f.name)
					.uniq()
					.value();
				_.extend(f, {'options': facetOptions});
			}, this);
		}
		if(key === 'eventDelay'){
			if( this.selectlist )
				this.selectlist.option('eventDelay', value);
		}
		if(key === 'filteredDataLength'){
			var resultCount = '',
				resultCountLabel;
			if(!_.isEmpty(this.options.selectedFacets)){
				resultCountLabel = value == 1 ? this.options.resultLabel : this.options.resultsLabel;
				resultCount = $.i18n.prop(resultCountLabel, value);
			} 
			this.element.find('.up-filter-header .up-filter-result').text(resultCount);
		}
	},
	'_render': function(){
		this.selectlist = this.element
			.empty()
			.append(this._getMarkup())
			.find('.up-selectlist')
				.selectlist({
					'facets': this.options.facets,
					'eventDelay': this.options.eventDelay
				})
				.data('upcycle-selectlist');
		this.update();
	},
	'_getMarkup': function(){
		var filterMarkup = this._getTemplate('filter')(this._getTemplateContext(this.options));
		return filterMarkup;
	},
	'_getTemplate': function(name){
		return eval(this.options.templatesNamespace)[name];
	},
	'_getTemplateContext': function(options){
		var context = _({}).extend(options);
		if(this.options.localizeLabels){
			_(context).extend({
				'label': $.i18n.prop(options.label),
				'clearAllLabel': $.i18n.prop(options.clearAllLabel)
			});
		}
		return context;
	}
});