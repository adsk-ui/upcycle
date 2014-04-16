$.widget('Upcycle.filter', {
	'options': {
		'templatesNamespace': 'Upcycle.templates',
		'data': {},
		'eventDelay': 0
	},
	'appliedFilters': {},
	
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
	'_create': function(){
		this._setOptions(this.options);
		this._on({'change': this._onChange});
		this._on({'click [data-action="clear-all"]': this.clear});
		this._on({'click [role="facet"] > [role="header"]': this._onToggle});
		this.element.addClass('filter'); 
		this._render();
	},
	'_render': function(){
		this.element
			.empty()
			.append(this._getMarkup(this.options.data));
		this._update();
	},
	'_update': function(){
		var $scrollArea = this.element.find('.scroll-area'),
			$viewport = $scrollArea.find('.viewport'),
			needsScrollbar = $viewport.prop('scrollHeight') > $viewport.prop('clientHeight'),
			tinyscrollbar = $scrollArea.data('plugin_tinyscrollbar');
		$scrollArea.toggleClass('scrollable', needsScrollbar);
		if(needsScrollbar && !tinyscrollbar){
			$scrollArea.tinyscrollbar();
		}else if(tinyscrollbar){
			tinyscrollbar.update();
		}
	},
	'_setOption': function(key, value){
		$.Widget.prototype._setOption.call(this, key, value);
		if(key === 'eventDelay'){
			this._triggerChangeEvent = _.debounce(function(event, appliedFilters){
				var that = this;
				if( this._debouncingChangeEvent ){
					clearInterval(this._debouncingChangeEvent);
				}
				this._debouncingChangeEvent = setTimeout(function(){
					delete that._debouncingChangeEvent;
					if(!_.isEqual(appliedFilters, that.appliedFilters)){
						that.appliedFilters = appliedFilters;
						that._trigger('change', event, {'appliedFilters': that.appliedFilters});	
					}
				}, this.options.eventDelay);
			}, value);
		}
	},
	'_onToggle': function(event){
		var that = this;
		$(event.currentTarget).toggleClass('collapsed');
		this._update();
	},
	'_onChange': function(event){
		var that = this;
		var appliedFilters = {};
		this.element.find('[type="checkbox"]').each(function(){
			if( this.checked ){
				var group = this.getAttribute('data-group'),
					facet = this.getAttribute('data-facet');	
				if(appliedFilters.hasOwnProperty(group)){
					appliedFilters[group].push( facet );
				}else{
					appliedFilters[group] = [facet];
				}
			}
		});
		this._triggerChangeEvent(event, appliedFilters);
	},
	'_getTemplateContext': function(data){
		data = data || {};
		data.facetCount = data.facets ? data.facets.length : 0;
		data.facetValuesCount = _.reduce(data.facets, function(memo, facet){
			return _.isArray(facet.options) ? memo + facet.options.length : memo;
		}, 0);
		return data;
	},
	'_getMarkup': function(data){
		var template = eval(this.options.templatesNamespace)['filter'],
			templateContext = this._getTemplateContext(data);
		return template(templateContext);
	}
});