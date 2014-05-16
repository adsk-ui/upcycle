$.widget('upcycle.filterpanel', $.upcycle.selectlist, {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'data': [],
		'selectedData': [],
		'localizeLabels': true,
		'label': 'FILTERPANEL_FILTERPANEL',
		'clearAllLabel': 'FILTERPANEL_CLEAR_ALL',
		'resultsLabel': 'FILTERPANEL_RESULTS',
		'resultLabel': 'FILTERPANEL_RESULT'
	},
	'_create': function(){
		this._super();
		this._on({'click [data-action="clear-all"]': function(){this.checkboxToggleAll(false);}});
		this.element
			.addClass('up-filterpanel')
			.removeClass('up-selectlist');
		this._setOptions(this.options);
	},
	'_triggerChangeEvent': function(event, selectedFacets, selectedData){
		this._trigger(':selection:changed', event, {'facets': selectedFacets, 'data': selectedData});	
	},
	'_onSelectionChange': function(event){
		var selectedFacets = this._getSelectedFacetList(),
			selectedData = this._getSelectedData(selectedFacets);
		this._setOption('selectedFacets', selectedFacets);
		this._setOption('selectedData', selectedData);
		this._debouncedTriggerChangeEvent(event, selectedFacets, selectedData);
	},
	'_setOption': function(key, value){
		this._super(key, value);
		if(key === 'data' || key === 'facets'){
			_(this.options.facets).each(function(f){
				if( !_.isEmpty(this.options.data) ){
					var facetOptions = _(this.options.data)
						.chain()
						.pluck(f.name)
						.uniq()
						.value();
					_.extend(f, {'options': facetOptions});
				}
			}, this);
			this._render();
		}
		if(key === 'selectedData'){
			var resultCount = '',
				resultCountLabel;
			if(!_.isEmpty(this.options.selectedFacets) && !_.isEmpty(this.options.data)){
				resultCountLabel = value.length == 1 ? this.options.resultLabel : this.options.resultsLabel;
				resultCount = $.i18n.prop(resultCountLabel, value.length);
			} 
			this.element.find('.up-filterpanel-header .up-filterpanel-result').text(resultCount);
		}
	},
	'_getSelectedData': function(selectedFacets){
		var selectedData = _(this.options.data)
			.chain()
			.filter(function(obj){
				return _(selectedFacets).every(function(facet){
					return _(facet.options).some(function(option){
						var actualValue = obj[facet.name];
						return actualValue == option;
					});
				});
			})
			.value();
		return selectedData;
	},
	'_getMarkup': function(){
		var filterMarkup = this._getTemplate('filterpanel')(this._getTemplateContext(this.options));
		return filterMarkup;
	},
	'_getTemplate': function(name){
		return eval(this.options.templatesNamespace)[name];
	},
	'_getTemplateContext': function(options){
		var context = _({
			'selectlist': this._getTemplate('selectlist')(this.options.facets)
		}).extend(options);
		if(this.options.localizeLabels){
			_(context).extend({
				'label': $.i18n.prop(options.label),
				'clearAllLabel': $.i18n.prop(options.clearAllLabel)
			});
		}
		return context;
	}
});