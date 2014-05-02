$.widget('upcycle.selectlist', {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'facets': [],
		'eventDelay': 0
	},
	'selection': {},
	'_create': function(){
		this._setOptions(this.options);
		this._on({'change': this._onChange});
		this._on({'click [role="facet"] > [role="header"]': this._onToggle});
		this._on({'click button.more, button.less': this.update});
		this.element.addClass('up-selectlist'); 
		this._render();
	},
	'_render': function(){
		this.element
			.empty()
			.append(this._getMarkup(this.options.facets));
		this.update();
	},
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
	},
	'_triggerChangeEvent': function(event, selection){
		if(!_.isEqual(selection, this.selection)){
			this.selection = selection;
			this._trigger('change', event, {'selectedFacets': this.selection});	
		}
	},
	'_setOption': function(key, value){
		$.Widget.prototype._setOption.call(this, key, value);
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
		var selection = {};
		this.element.find('[type="checkbox"]').each(function(){
			if( this.checked ){
				var group = this.getAttribute('data-facet'),
					facet = this.getAttribute('data-facet-option');	
				if(selection.hasOwnProperty(group)){
					selection[group].push( facet );
				}else{
					selection[group] = [facet];
				}
			}
		});
		this._debouncedTriggerChangeEvent(event, selection);
	},
	'_getMarkup': function(facets){
		var template = eval(this.options.templatesNamespace)['selectlist']
		return template(this.options.facets);
	}
});