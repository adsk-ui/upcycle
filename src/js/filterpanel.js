$.widget('upcycle.filterpanel', {
	'defaultElement': '<div>',
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'localizeLabels': true,
		'label': 'FILTERPANEL_FILTERPANEL',
		'clearAllLabel': 'FILTERPANEL_CLEAR_ALL',
		'resultsLabel': 'FILTERPANEL_RESULTS',
		'resultLabel': 'FILTERPANEL_RESULT',
		'data': [],
		'facets': [],
		'selectedFacets': [],
		'eventDelay': 0,
		'dataExtraction': null
	},
	'_create': function(){
		this._on({'click [data-action="clear-all"]': this.clear});
		this._on({'selectlistchange': this._onFilterChange});
		this.element.addClass('up-filterpanel');
		this._setOptions(this.options);
		// this._render();
	},
	'set': function(facets, options){
		var changedBoxes = [];
		options = options || {};
		facets = _.isArray(facets) ? facets : _.isObject(facets) ? [facets] : [];
		this.element.find('[type="checkbox"]')
			.each(function(){
				var boxFacetName = this.getAttribute('data-facet'),
					boxOptionValue = this.getAttribute('data-facet-option'),
					setThisBox = _(facets).some(function(facet){
						return facet.name === boxFacetName && _(facet.options).contains(boxOptionValue);
					}),
					newCheckedValue;
				if(setThisBox){
					newCheckedValue = _.isUndefined(options.toggle) ? !this.checked : !!options.toggle;
					if(newCheckedValue !== this.checked){
						this.checked = newCheckedValue;
						changedBoxes.push(this);
					}
				}
			});
		if(changedBoxes.length && !options.silent)
			$(changedBoxes).trigger('change');
		return this;
	},
	/**
	 * Clears all checkboxes (deselects all filters)		
	 * @return {jQuery} A jQuery object containing the element associated to this widget
	 */
	'clear': function(options){
		var changed, $checkboxes;
		options = options || {};
		$checkboxes = this.element.find('[type="checkbox"]').each(function(index, checkbox){
			if(checkbox.checked)
				changed = true;
			checkbox.checked = false;
		});
		if(changed && !options.silent)
			$checkboxes.trigger('change');
		return this;
	},
	'update': function(){
		this.selectlist.update();
		return this;
	},
	'_onFilterChange': function(event, data){
		event.stopPropagation();
		this.option('selectedFacets', data.selectedFacets);
	},
	'_triggerChangeEvent': function(event){
		var filteredData = [],
			selectedFacets = this.options.selectedFacets,
			dataExtraction = this.options.dataExtraction;
		if(!_.isEmpty(this.options.data)){
			filteredData = _(this.options.data)
				.chain()
				.filter(function(obj){
					return _(selectedFacets).every(function(facet){
						return _(facet.options).some(function(option){
							var actualValue = _(dataExtraction).isFunction() ? dataExtraction(obj, facet.name) : obj[facet.name];
							return actualValue == option;
						});
					});
				})
				.value();
		}
		this._setOption('filteredData', filteredData);
	},
	'_setOption': function(key, value){
		this._super(key, value);
		if(key === 'data' || key === 'facets'){
			this.clear();
			_(this.options.facets).each(function(f){
				var facetOptions = _(this.options.data)
					.chain()
					.pluck(f.name)
					.uniq()
					.value();
				_.extend(f, {'options': facetOptions});
			}, this);
			this._render();
		}
		if(key === 'eventDelay'){
			if( this.selectlist )
				this.selectlist.option('eventDelay', value);
		}
		if(key === 'filteredData'){
			var resultCount = '',
				resultCountLabel;
			if(!_.isEmpty(this.options.selectedFacets)){
				resultCountLabel = value.length == 1 ? this.options.resultLabel : this.options.resultsLabel;
				resultCount = $.i18n.prop(resultCountLabel, value.length);
			} 
			this.element.find('.up-filterpanel-header .up-filterpanel-result').text(resultCount);

			this._trigger('change', event, {
				'selectedFacets': this.options.selectedFacets,
				'filteredData': this.options.filteredData
			});
		}

		if(key === 'selectedFacets'){
			this._triggerChangeEvent(event);
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
		var filterMarkup = this._getTemplate('filterpanel')(this._getTemplateContext(this.options));
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