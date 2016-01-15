$.widget('upcycle.filterpanel', $.upcycle.selectlist, {
	'options': {
		'templateName': 'filterpanel',
		'data': [],
		'selectedData': [],
		'selectedFacets': [],
		'label': 'FILTERPANEL_FILTERPANEL',
		'clearAllLabel': 'FILTERPANEL_CLEAR_ALL',
		'resultsLabel': 'FILTERPANEL_RESULTS',
		'resultLabel': 'FILTERPANEL_RESULT',
		'closeLabel': 'FILTERPANEL_CLOSE'
	},
	'_create': function(){
		this._super();
		this._on({'click [data-action="clear-all"]': function(){this.checkboxToggleAll(false);}});
	},
	'_render': function(){
		this.element.html(this._getMarkup(this.options));
		return this.update();
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
				f.mapData = f.mapData || function(data){ return data; };
				if( !_.isEmpty(this.options.data) ){
					var facetOptions = _(this.options.data)
						.chain()
						.pluck(f.name)
						.map(f.mapData)
						.flatten()
						.uniq()
						.value();
					_.extend(f, {'options': facetOptions});
				}
			}, this);
			this._setOption('selectedData', this._getSelectedData(this._getSelectedFacetList()));
			this._render();
		}
		if(key === 'selectedData'){
			var resultCount = '',
				resultCountLabel;
			if(!_.isEmpty(this.options.selectedFacets) && !_.isEmpty(this.options.data)){
				resultCountLabel = value.length == 1 ? this.options.resultLabel : this.options.resultsLabel;
				resultCount = this.options.localizeLabels ? $.i18n.prop(resultCountLabel, value.length) : value.length + ' ' +resultCountLabel;
			}
			this.element.find('.up-filterpanel-header .up-filterpanel-result').text(resultCount);
		}
	},
	'_getSelectedData': function(selectedFacets){
		var selectedData = _(this.options.data)
			.chain()
			.filter(function(obj){
				return _(selectedFacets).every(function(facet){
					facet.validateMatch = facet.validateMatch || function(selectedOption, data){
						return selectedOption === data;
					};
					return _(facet.options).some(_(facet.validateMatch).partial(_, obj[facet.name]));
				});
			})
			.value();
		return selectedData;
	},
	'_getMarkup': function(){
		return this._getTemplate()(this._getTemplateContext(this.options));
	},
	'_getTemplateContext': function(options){
		var template = this._getTemplate('selectlist'),
			context = _({
				'selectlist': template(this.options.facets)
			}).extend(options);
		if(this.options.localizeLabels){
			_(context).extend({
				'label': $.i18n.prop(options.label),
				'clearAllLabel': $.i18n.prop(options.clearAllLabel),
				'closeLabel': $.i18n.prop(options.closeLabel)
			});
		}
		return context;
	}
});