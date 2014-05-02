$.widget('upcycle.selectlist', $.upcycle.facetlist, {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'selectedFacets': [],
		'eventDelay': 0
	},
	'_create': function(){
		this._super();
		this._setOptions(this.options);
		this._on({'change': this._onChange});
		this._on({'click [role="facet"] > [role="header"]': this._onToggle});
		this._on({'click button.more, button.less': this.update});
		this.element
			.addClass('up-selectlist')
			.removeClass('up-facetlist'); 
		this._render();
	},
	// '_render': function(){
	// 	this.element.html(this._getMarkup());
	// 	return this.update();
	// },
	'update': function(){
		var $scrollArea = this.element.find('.scroll-area'),
			$viewport = $scrollArea.find('.viewport'),
			needsScrollbar = $viewport.prop('scrollHeight') > $viewport.prop('clientHeight'),
			tinyscrollbar = $scrollArea.data('plugin_tinyscrollbar');
		/**
		 * More/Less
		 */
		$viewport.find('.up-facet-options').each(function(){
			var $facetOptions = $(this);
			if( $facetOptions.children().length > 4 ){
				$facetOptions.moreless({
					'minItems': 4
				});
			}
		});
		/**
		 * Scrollbar
		 */
		$scrollArea.toggleClass('scrollable', needsScrollbar);
		if(needsScrollbar && !tinyscrollbar){
			$scrollArea.tinyscrollbar();
		}else if(tinyscrollbar){
			tinyscrollbar.update('relative');
		}
		return this;
	},
	'_triggerChangeEvent': function(event, selectedFacets){
		if(!_.isEqual(selectedFacets, this.options.selectedFacets)){
			this.options.selectedFacets = selectedFacets;
			this._trigger('change', event, {'selectedFacets': this.options.selectedFacets});	
		}
	},
	'_setOption': function(key, value){
		this._super(key, value);
		if(key === 'eventDelay'){
			this._debouncedTriggerChangeEvent = _.debounce(this._triggerChangeEvent, this.options.eventDelay);
		}
		if(key === 'facets'){
			this.options.facetOptionsCount = _.reduce(value, function(memo, facet){
				return _.isArray(facet.options) ? memo + facet.options.length : memo;
			}, 0);
		}
	},
	'_onToggle': function(event){
		$(event.currentTarget).toggleClass('collapsed');
		this.update();
	},
	'_onChange': function(event){
		var selectedFacets = {},
			selectedFacetList = [],
			facet, option;
		this.element.find('[type="checkbox"]').each(function(){
			if( this.checked ){
				facet = this.getAttribute('data-facet'),
				option = this.getAttribute('data-facet-option');	
				if(selectedFacets.hasOwnProperty(facet)){
					selectedFacets[facet].push( option );
				}else{
					selectedFacets[facet] = [option];
				}
			}
		});
		selectedFacetList = _(selectedFacets).map(function(options, name){
			facet = _(this.options.facets).findWhere({'name': name});
			return facet ? {
				'name': name,
				'displayName': facet.displayName,
				'options': options
			} : null;
		}, this);
		this._debouncedTriggerChangeEvent(event, selectedFacetList);
	},
	'_getMarkup': function(){
		var template = eval(this.options.templatesNamespace)['selectlist']
		return template(this.options.facets);
	}
});