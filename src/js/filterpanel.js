$.widget('upcycle.filterpanel', $.upcycle.selectlist, {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'data': [],
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
		var selectedFacetList = this._getSelectedFacetList(),
			selectedData = this._getSelectedData(selectedFacetList);
		this._debouncedTriggerChangeEvent(event, selectedFacetList, selectedData);
	},
	'_setOption': function(key, value){
		this._super(key, value);
		if(key === 'data' || key === 'facets'){
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
	},
	'_getSelectedData': function(facets){
		var data = this.options.data,
			selectedData = [],
			item;
		_(facets).each(function(f){
			_(f.options).each(function(o){
				item = _(data).find(function(d){
					return d[f.name] == o;
				});
				if(item)
					selectedData.push(item);
			});
		});
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