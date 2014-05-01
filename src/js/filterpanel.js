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
		'searchQuery': '',
		'eventDelay': 0,
		'dataExtraction': null
	},
	'_create': function(){
		this._setOptions(this.options);
		this._on({'click [data-action="clear-all"]': this.clear});
		this._on({'selectlistchange': this._onFilterChange});
		this.element.addClass('up-filterpanel');
		this._render();
	},
	'set': function(facets, toggle){
		var changedBoxes = [];
		this.element.find('[type="checkbox"]')
			.each(function(){
				var boxFacetName = this.getAttribute('data-facet'),
					boxOptionValue = this.getAttribute('data-facet-option'),
					setThisBox = _(facets).some(function(values, key){
						values = _.isString(values) ? [values] : _.isArray(values) ? values : [];
						return key === boxFacetName && _(values).contains(boxOptionValue);
					}),
					newCheckedValue;
				if(setThisBox){
					newCheckedValue = _.isUndefined(toggle) ? !this.checked : !!toggle;
					if(newCheckedValue !== this.checked){
						this.checked = newCheckedValue;
						changedBoxes.push(this);
					}
				}
			});
		if(changedBoxes.length)
			$(changedBoxes).trigger('change');
		return this;
	},
	/**
	 * Clears all checkboxes (deselects all filters)		
	 * @return {jQuery} A jQuery object containing the element associated to this widget
	 */
	'clear': function(){
		this.element.find('[type="checkbox"]').each(function(index, checkbox){
			checkbox.checked = false;
		}).trigger('change');
		return this;
	},
	'update': function(){
		this.selectlist.update();
		return this;
	},
	'search': function(query){
		return this;
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
			selectedFacets = this.options.selectedFacets,
			dataExtraction = this.options.dataExtraction;
		if(!_.isEmpty(this.options.data)){
			filteredData = _(this.options.data)
				.chain()
				.filter(function(obj){
					return _(selectedFacets).every(function(values, facetName){
						return _(values).some(function(value){
							var actualValue = _(dataExtraction).isFunction() ? dataExtraction(obj, facetName) : obj[facetName];
							return actualValue == value;
						});
					});
				})
				.value();
		}
		console.log('change filter data length to: '+filteredData.length);
		console.log(selectedFacets);
		this.option('filteredDataLength', filteredData.length);
		this._trigger('change', event, {
			'selectedFacets': this.options.selectedFacets,
			'filteredData': filteredData
		});
	},
	'_setOption': function(key, value){
		$.Widget.prototype._setOption.call(this, key, value);
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
			console.log('update result count: '+resultCount);
			this.element.find('.up-filterpanel-header .up-filterpanel-result').text(resultCount);
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