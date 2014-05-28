$.widget('upcycle.selectlist', $.upcycle.facetlist, {
	'options': {
		'templateName': 'selectlist',
		'eventDelay': 0
	},
	'_create': function(){
		this._super();
		this._on({'change': this._onSelectionChange});
		this._on({'click [role="facet"] > [role="header"]': this._onToggleFacetHeader});
		this._on({'click button.more, button.less': this.update});
	},
	'_render': function(){
		this.element.html(this._getMarkup(this.options.facets));
		return this.update();
	},
	'update': function(){
		var that = this,
			$scrollArea = this.element.find('.scroll-area'),
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
					'minItems': that.options.moreLessMin
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
	'checkboxToggle': function(facets, stateValue, options){
		var $changed = $(),
			$checkboxes = this.element.find('[type="checkbox"]'),
			checked,
			checkbox;
		options = options || {};
		_(facets).each(function(f){
			_(f.options).each(function(o){
				checkbox = $checkboxes.filter('[data-facet="'+f.name+'"][data-facet-option="'+$.upcycle.escapeForSelector(o)+'"]').get(0);
				if(checkbox){
					checked = _.isBoolean(stateValue) ? stateValue : !checkbox.checked;
					if(checked !== checkbox.checked)
						$changed = $changed.add(checkbox);
					checkbox.checked = checked;
				}
			});
		});
		if($changed.length && !options.silent)
			$changed.trigger('change');
		return this;
	},
	'checkboxToggleAll': function(stateValue, options){
		var $changed = $(),
			$checkboxes = this.element.find('[type="checkbox"]'),
			checked;
		options = options || {};
		$checkboxes.each(function(i, checkbox){
			checked = _.isBoolean(stateValue) ? stateValue : !checkbox.checked;
			if(checked !== checkbox.checked)
				$changed = $changed.add(checkbox);
			checkbox.checked = checked;
		});
		if($changed.length && !options.silent)
			this._onSelectionChange(null);
		return this;
	},
	
	'_triggerChangeEvent': function(event, selectedFacets){
		this._trigger(':selection:changed', event, {'facets': selectedFacets});	
	},
	'_setOption': function(key, value){
		this._super(key, value);
		if(key === 'eventDelay'){
			this._debouncedTriggerChangeEvent = _.debounce(this._triggerChangeEvent, this.options.eventDelay);
		}
	},
	'_onToggleFacetHeader': function(event){
		$(event.currentTarget).toggleClass('collapsed');
		this.update();
	},
	'_onSelectionChange': function(event){
		this._debouncedTriggerChangeEvent(event, this._getSelectedFacetList());
	},
	'_getSelectedFacetList': function(){
		var selectedFacets = {},
			selectedFacetList = [],
			facet, name, option;
		this.element.find('[type="checkbox"]').each(function(){
			if( this.checked ){
				name = this.getAttribute('data-facet');
				option = this.getAttribute('data-facet-option');	
				if(selectedFacets.hasOwnProperty(name)){
					selectedFacets[name].push( option );
				}else{
					selectedFacets[name] = [option];
				}
			}
		});
		selectedFacetList = _(selectedFacets).reduce(function(memo, options, name){
			facet = _(this.options.facets).findWhere({'name': name});
			if(facet){
				memo.push({
					'name': facet.name,
					'displayName': facet.displayName,
					'options': options
				});
			}
			return memo;
		}, [], this);
		return selectedFacetList;
	}
});