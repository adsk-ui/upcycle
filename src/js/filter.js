$.widget('upcycle.filter', {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'label': 'Filters',
		'clearAllLabel': 'Clear all',
		'resultsLabel': 'Results',
		'data': [],
		'facets': [],
		'eventDelay': 0
	},
	'_create': function(){
		this._setOptions(this.options);
		this._on({'click [data-action="clear-all"]': this.clear});
		this.element.addClass('filter');
		this._render();
	},
	/**
	 * Clears all checkboxes (deselects all filters)		
	 * @return {jQuery} A jQuery object containing the element associated to this widget
	 */
	'clear': function(){
		this.element.find('[type="checkbox"]').each(function(index, checkbox){
			checkbox.checked = false;
		});
		return this.element;
	},
	'_render': function(){
		var that = this;
		this.selectlist = this.element
			.empty()
			.append(this._getMarkup())
			.find('.selectlist')
				.selectlist({
					'facets': this.options.facets,
					'eventDelay': this.options.eventDelay
				})
				.on('selectlistchange', function(event, data){
					that._trigger('change', event, data);
				})
				.data('upcycle-selectlist');
		this.update();
	},
	'update': function(){
		this.selectlist.update();
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
	},
	'_getMarkup': function(){
		var filterMarkup = this._getTemplate('filter')(this.options);
		return filterMarkup;
	},
	'_getTemplate': function(name){
		return eval(this.options.templatesNamespace)[name];
	},
	'_getTemplateContext': function(options){
		
		return options;
	}
});