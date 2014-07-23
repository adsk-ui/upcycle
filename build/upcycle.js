(function($){
	$.fn.positionRelativeTo = function( obj ){
		var $trg = ( obj instanceof jQuery ) ? obj : $(obj),
			$context = this,
			trgPos = {top:0, left:0}, pos;
		var safety = -100;
		do{
			pos = $context.position();
			trgPos.top += pos.top;
			trgPos.left += pos.left;
			$context = $context.offsetParent();
			safety++;
		}while( $trg.length && !$context.is($trg) && !$context.is('body') );
		return trgPos;
	};
	$.fn.countSamePositionY = function(stopAt){
		var positions = [], toc = {}, top;
		$.each(this, function(){
			top = $(this).position().top;
			if( !toc.hasOwnProperty(top) ){
				if( stopAt && stopAt === positions.length )
					return false;
				toc[top] = true;
				positions.push({'top': top, 'count': 1});
			}else{
				positions[positions.length - 1].count++;
			}
		});
		return positions;
	};
	// http://stackoverflow.com/questions/1273566/how-do-i-check-if-the-mouse-is-over-an-element-in-jquery/1670561#1670561
	/**
	 * Allows the mouse to enter popover content without
	 * closing the popover.
	 * Stores the timeoutId in the triggering element.
	 * Invokes the callback provided once setTimeout executes.
	 */
	$.fn.hoverInContent = function($timeoutStore, timeout, cb) {
		this.mouseenter(function (e) {
			clearTimeout($timeoutStore.data('timeoutId'));
		})
		.mouseleave(function (e) {
			e.stopImmediatePropagation();
			var timeoutId = setTimeout(function () {
					cb.call($timeoutStore);
				}, timeout);
			$timeoutStore.data('timeoutId', timeoutId);
		});
		return this;
	};
})(jQuery);
$.widget('upcycle.base', {
	'options':{
		'templatesNamespace': 'upcycle.templates',
		'templateName': '',
		'localizeLabels': true
	},
	'_create': function(){
		this.element.addClass(this.widgetFullName);
		this._setOptions(this.options);
	},
	'_getMarkup': function(){
		var template = this._getTemplate();
		return template(this._getTemplateContext.apply(this, arguments));
	},
	'_getTemplate': function(templateName){
		var templates = (function(){return this;})(),
			spaces = this.option('templatesNamespace').split('.');
		for (var i=0; i<spaces.length; i++) {
			if (_.has(templates, spaces[i])) {
				templates = templates[ spaces[i] ];
			}
			else {
				throw new Error(this.option('templatesNamespace') + ' not found');
			}
		}
		templateName = templateName || this.options.templateName;
		return templates[templateName || this.option('templateName')];
	},
	'_getLabel': function(label){
		return this.options.localizeLabels ?  $.i18n.prop( label ) : label;
	}
});

$.upcycle.escapeForSelector = function(val){
	return typeof val === 'string' ? val.replace(/\\/, '\\\\') : val;
};
$.widget('upcycle.facetlist', $.upcycle.base, {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'templateName': 'facetlist',
		'facets': [],
		'moreLessMin': 4,
		'moreLessLinkContainer': null,
		'moreLessOpenByDefault': false,
		'label': 'FACETLIST_LABEL'
	},
	'_create': function(){
		this._super();
		this._on({'click [role="button"][data-action="remove"]': this._onRemove});
		this._render();
	},
	'_render': function(){
		this.element.html(this._getMarkup(this.options));
		return this.update();
	},
	'update': function(){
		/**
		 * More/Less
		 */
		var $facets = this.element.find('.up-facets'),
			moreLessOptions = {
				'minItems': this.options.moreLessMin,
				'linkContainer': this.options.moreLessLinkContainer,
				'openByDefault': this.options.moreLessOpenByDefault
			};
		if( this.options.more ){
			moreLessOptions.more = this._getLabel(this.options.more);
		}
		if( this.options.less ){
			moreLessOptions.less = this._getLabel(this.options.less);
		}
		$facets.moreless( moreLessOptions );
		
		return this;		
	},
	'add': function(facetsToAdd, options){
		facetsToAdd = _.isArray(facetsToAdd) ? facetsToAdd : _.isObject(facetsToAdd) ? [facetsToAdd] : [];
		options = options || {};
		var facets = this.options.facets,
			added = [];
		_(facetsToAdd).each(function(facetToAdd){
			var existing = _(facets).findWhere({'name': facetToAdd.name}),
				preExistingOptionsLength;
			if(existing){
				preExistingOptionsLength = existing.options.length;
				existing.options = _(existing.options.concat(facetToAdd.options)).uniq();
				if(preExistingOptionsLength < existing.options.length)
					added.push(facetToAdd);
			}else{
				facets.push(facetToAdd);
				added.push(facetToAdd);
			}
		}, this);
		if(added.length && !options.silent){
			this._trigger(':facets:add', null, {
				'facets': added
			});
		}
		return this._setOption('facets', facets, options);
	},
	'remove': function(facetsToRemove, options){
		facetsToRemove = _.isArray(facetsToRemove) ? facetsToRemove : _.isObject(facetsToRemove) ? [facetsToRemove] : [];
		options = options || {};
		var remainingOptions,
			removedOptions,
			removed = [],
			facets = _(this.options.facets).reject(function(facet){
				var toRemove = _(facetsToRemove).findWhere({'name': facet.name});
				if(toRemove){
					remainingOptions = _(facet.options).difference(toRemove.options);
					removedOptions = _(facet.options).intersection(toRemove.options);
					facet.options = remainingOptions;
					toRemove.options = removedOptions;
					removed.push(toRemove);
					return !remainingOptions.length;
				}
			});
		if(removed.length && !options.silent){
			this._trigger(':facets:remove', null, {
				'facets': removed
			});
		}
		return this._setOption('facets', facets, options);
			
	},
	'reset': function(facets, options){
		options = options || {};
		if(!options.silent){
			if(this.options.facets.length){
				this._trigger(':facets:remove', null, {
					'facets': this.options.facets
				});
			}
			if(facets && facets.length){
				this._trigger(':facets:add', null, {
					'facets': facets
				});
			}
		}
		return this._setOption('facets', facets || [], options);
	},
	'change': function(facetsToChange){
		var element = this.element,
			facets = this.option('facets'),
			match;
		_(facetsToChange).each(function(optionMap, facetName){
			match = _(facets).find(function(f){return f.name === facetName;});
			if(match){
				_(optionMap).each(function(newValue, oldValue){
					_(match.options).each(function(value, index){
						if(value === oldValue){
							match.options.splice(index, 1, newValue);
							element.find('[data-facet="'+match.name+'"][data-facet-option="'+$.upcycle.escapeForSelector(oldValue)+'"]')
								.attr('data-facet-option', newValue)
								.find('.up-facet-option-name')
									.text(newValue);
						}
					});
				});
			}
		});
	},
	'_setOption': function(key, value, options){
		this._super(key, value);
		options = options || {};
		if(key === 'facets'){
			this._render();
			if(!options.silent){
				this._trigger(':facets:changed', null, {
					'facets': this.options.facets
				});
			}
		}
		if(key === 'moreLessMin'){
			this._render();
		}
		return this;
	},
	'_onRemove': function(event){
		var $item = $(event.currentTarget).parent(),
			facetAtts = this._getFacetAtts($item);
		return this.remove({
			'name': facetAtts.name,
			'options': [facetAtts.option]
		});
	},
	'_getFacetAtts': function(element){
		element = element instanceof $ ? element.get(0) : element;
		return {
			'name': element.getAttribute('data-facet'),
			'option': element.getAttribute('data-facet-option')
		};
	},
	'_getTemplateContext': function(options){
		var context = _({}).extend(options);
		if(this.options.localizeLabels){
			_(context).extend({
				'label': $.i18n.prop(options.label)
			});
		}
		return context;
	}
});
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
		var moreLessOptions = {
				'minItems': that.options.moreLessMin
			};
		if( this.options.more ){
			moreLessOptions.more = this._getLabel(this.options.more);
		}
		if( this.options.less ){
			moreLessOptions.less = this._getLabel(this.options.less);
		}
		$viewport.find('.up-facet-options').each(function(){
			var $facetOptions = $(this);
			if( $facetOptions.children().length > 4 ){
				$facetOptions.moreless( moreLessOptions );
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
		if($changed.length && !options.silent){
			$changed.trigger('change');
		}else if(options.force){
			this._onSelectionChange(null);
		}
		return this;
	},
	'checkboxDisable': function(facets, stateValue){
		var $checkboxes = this.element.find('[type="checkbox"]'),
		checkbox;
		_(facets).each(function(f){
			_(f.options).each(function(o){
				// find reusable solution for selecting attribute values with backslashes?
				o = o.replace(/\\/, '\\\\');
				checkbox = $checkboxes.filter('[data-facet="'+f.name+'"][data-facet-option="'+o+'"]').get(0);
				if(checkbox){
					if(stateValue)
						$(checkbox).addClass('disabled').prop('disabled', stateValue);
					else
						$(checkbox).removeClass('disabled').prop('disabled', stateValue);
				}
			});
		});
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
		if(($changed.length && !options.silent) || options.force)
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
$.widget('upcycle.editable', $.upcycle.base, {
	'options': {
		'templateName': 'editable',
		'textSelector': '',
		'popoverClass': '',
		'popoverContainer': null,
		'popoverPlacement': 'bottom',
		'textInputMaxLength': null,
		'defaultButtonLabel': 'EDITABLE_DEFAULT_BUTTON_LABEL'
	},
	'_create': function(){
		this._super();
		this._on({
			'click .editable': this._onEditOpen
		});
	},
	'_onEditOpen': function(event){
		event.stopPropagation();
		this._render(event.currentTarget);
	},
	'_onEditChange': function(event, revert){
		var ENTER_KEY = 13,
			$targetElement = this.$targetElement,
			defaultValue = this.option('targetElementDefaultValue'),
			oldValue = this._getTargetElementText(), 
			newValue = revert ? defaultValue : event.target.value;
		revert = defaultValue === newValue;
		if( !$targetElement )
			return;
		if( event.keyCode !== ENTER_KEY && !revert )
			return;
		
		if(oldValue !== newValue){
			$targetElement.attr('data-default-value', revert ? null : defaultValue);
			this._setTargetElementText(newValue);
			this._trigger(':value:change', event, {
				'oldValue': oldValue,
				'newValue': newValue,
				'element': $targetElement[0],
				'revert': revert
			});
		}
		this._destroy();
	},
	'_onRevert': function(event){
		this._onEditChange(event, true);
	},
	'_render': function(targetElement){
		if(this.$targetElement && this.$targetElement[0] === targetElement)
			return;
		if(this.$targetElement)
			this._destroy();

		var $targetElement = this.$targetElement = $(targetElement),
			widgetFullName = this.widgetFullName,
			popoverClass = this.option('popoverClass'),
			view = this;

		function __closePopover(event){
			$targetElement.popover('hide');
		}

		function __revert(event){
			view._onEditChange(event, true);
		}

		$targetElement
			.popover({
				'container': this.option('popoverContainer') || this.element,
				'html': true,
				'placement': this.option('popoverPlacement'),
				'content': this._getMarkup($targetElement)
			})
			.on('show', function(){
				var popover = $(this).addClass('editing').data('popover');
				popover.tip()
					.addClass(widgetFullName+'-popover')
					.addClass(popoverClass);
			})
			.on('shown', function(){
				var popover = $(this).addClass('editing').data('popover');
				popover.tip().find('input[type="text"]').focus();
				popover.tip().on('click', '[data-action="revert"]', __revert);
				popover.tip().on('click', function(event){
					event.stopPropagation();
				});
				$(document).on('click', __closePopover);
			})
			.on('hidden', function(){
				var $this = $(this);
				$this.removeClass('editing');
				$(document).off('click', __closePopover);
			})
			.popover('show')
			.data('popover')
				.tip()
					.on('keydown', _.bind(this._onEditChange, this));
		this.option('targetElementDefaultValue', $targetElement.attr('data-default-value') || this._getTargetElementText());
	},
	'_destroy': function(){
		delete this.options.targetElementDefaultValue;
		if( this.$targetElement ){
			this.$targetElement.removeClass('editing');
			if( this.$targetElement.data('popover') ){
				this.$targetElement.data('popover').tip().off();
			}
			this.$targetElement.popover('destroy');
			this.$targetElement = null;
		}
	},
	'_getTargetElementText': function(){
		var $targetElement = this.$targetElement,
			text = '';
		if($targetElement){
			text = this.option('textSelector') ? 
				$targetElement.find(this.option('textSelector')).text() : 
					$targetElement.text();
		}
		return $.trim(text);
	},
	'_setTargetElementText': function(text){
		var $targetElement = this.$targetElement;
		if($targetElement){
			if( this.option('textSelector') ){
				$targetElement.find(this.option('textSelector')).text(text);
			}else{
				$targetElement.text(text);
			}
		}
	},
	'_getTemplateContext': function($targetElement){
		var context = {},
			attr = _.bind($targetElement.attr, $targetElement),
			i18n = $.i18n.prop,
			localizeLabels = this.option('localizeLabels');
		if($targetElement){
			context = {
				'newValueLabel': localizeLabels ? i18n(attr('data-new-label')) : attr('data-new-label'),
				'newValuePlaceholder': localizeLabels ? i18n(attr('data-new-placeholder')) : attr('data-new-placeholder'),
				'defaultValueLabel': localizeLabels ? i18n(attr('data-default-label')) : attr('data-default-label'),
				'defaultValue': attr('data-default-value'),
				'defaultButtonLabel': localizeLabels ? i18n(this.option('defaultButtonLabel')) : this.option('defaultButtonLabel'),
				'currentValueIsDefault': _.isEmpty(attr('data-default-value'))
			};
			if( _.isNumber(this.options.textInputMaxLength) )
				context.textInputMaxLength = this.options.textInputMaxLength;
		}
		return context;
	}
});
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
				if( !_.isEmpty(this.options.data) ){
					var facetOptions = _(this.options.data)
						.chain()
						.pluck(f.name)
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
Handlebars.registerHelper('tinyscrollbar', function(){
	var options = arguments[arguments.length - 1];
	var includeScrollArea = arguments.length > 0 ? arguments[0] : false;
	var viewportClasses = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1, arguments.length - 1).join(' ') : '';
	var buffer = '';
	buffer += '<div class="scrollbar disable"><div class="track"><div class="thumb"></div></div></div><div class="viewport' + (viewportClasses ? ' ' + viewportClasses : '') + '"><div class="overview">';
	buffer += options.fn(this);
	buffer += '</div></div>';
	if( includeScrollArea ){
		buffer = '<div class="scroll-area">' + buffer + '</div>';
	}
	return buffer;
});
Handlebars.registerHelper("zebra", function(list, options){
	if (!list) return "";
	var buffer = "";
	for(var i=0; i<list.length; i++){
		list[i].stripe = i % 2 === 0 ? options.hash.odd || 'odd' : options.hash.even || 'even';
		buffer += options.fn(list[i]);
	}
	return buffer;
});
// Generic tooltip triggered by mouse hover.
// Built on Bootstrap's popover.
$.widget('upcycle.hover_tooltip', $.upcycle.base, {
    'options': {
        // defaults
        'templateName': 'hover_tooltip',
        'activatorTimeout': 300,
        'contentTimeout': 150,
        'hoverInContent': false,
        'placement': 'right',
        'container': 'body',
        'classes': '', // customizable class

        // Required
        'content': null,

        // scrollbar options
        'maxHeight': null,
        'thumbSize': 50
    },
    '_create': function(){
        if (this.option('content') === null) throw new Error('No content provided');
        var self = this,
            $el = this.element,
            $popover, $tip,
            scrollable = self.option('maxHeight') !== null,
            scrollHeight,
            $scrollArea, $viewport, $overview;

        this._super();

        // Initialize popover
        $popover = $el.popover({
            'animation': false,
            'placement': self.option('placement'),
            'html': true,
            'container': self.option('container'),
            'content': function () {
                return scrollable ?
                            self._getMarkup(self.option('content')) :
                            self.option('content');
            }
        })
        .on('show', function() {
            $(this).data('popover').tip()
                .addClass(self.widgetFullName)
                .addClass(self.option('classes'));
        })
        .on('shown', function() {
            if (self.option('hoverInContent')) {
                var $content = $('.popover').find('.arrow, .popover-content');
                $content.hoverInContent($el, self.option('contentTimeout'), self._closeFromTriggerElement);
            }
            // Scrollbar
            if (scrollable) {
                $tip = $popover.data('popover').tip();
                $tip.find('.popover-content').css('max-height', self.option('maxHeight')+'px');

                $scrollArea = $tip.find('.scroll-area');
                $viewport = $tip.find('.viewport');
                $overview = $tip.find('.overview');
                scrollHeight = $overview.height();

                if (scrollHeight > self.option('maxHeight')) {
                    $viewport.height(self.option('maxHeight'));
                    $scrollArea.tinyscrollbar({
                        thumbSize: self.option('thumbSize')
                    });
                }
                else {
                    $viewport.height(scrollHeight);
                }
            }
        });

        if (self.option('hoverInContent')) {
            $el.hoverInContent($el, this.option('activatorTimeout'), self._closeFromTriggerElement);
        }

        this._on({
            'mouseenter': function (e) {
                $el.popover('show');
            },
            'mouseleave': function () {
                $el.popover('hide');
            }
        });
    },
    _closeFromTriggerElement: function () {
        this.popover('hide');
    },
    close: function() {
    	this.element.popover('hide');
    },
    _getTemplateContext: function() {
        return {
            'content': this.option('content')
        };
    }
});
(function($){
	/**
	 * Default settings
	 * ================================
	 * - openByDefault: show the element in its "more" state
	 * - minItems: the number of items to show in the "less" state
	 * - minHeight: if set, this overrides minItems and sets the element to a minimum height in the "less" state
	 * - itemClass: if specified, this is a selector used to identify items to show more/less of
	 * - more: Label text for the "More" link
	 * - less: Label text for the "Less" link
	 * - linkContainer: an element to put the more/less links; this will be the element itself if left unspecified
	 * - linkClass: any custom CSS class to add to the more/less links
	 * - truncateText: add ellipses to text nodes
	 * @type {Object}
	 */
	var defaults = {
		'openByDefault': false,
		'minItems': 2,
		'itemClass': '',
		'more': 'More',
		'less': 'Less',
		'linkContainer': null,
		'linkClass': '',
		'truncateText': false
	},
	internal = {
		'items': function(){
			var $this = this;
			return $this.settings.itemClass ? $this.find('.' + $this.settings.itemClass) : $this.children().not('.less, .more');
		},
		'getSelector': function(obj){
			return obj ? obj instanceof jQuery ? obj : $(obj) : null;
		},
		'getMinItems': function(){
			var $this = this,
				minItems = $this.settings.minItems,
				minItemsByPosition = [];
			if(_.isString(minItems)){
				switch(minItems){
					case "same-y":
						minItemsByPosition = internal.items.call(this).countSamePositionY(1);
						break;
				}
			}
			return minItemsByPosition.length ? minItemsByPosition[0].count : minItems;
		}
	},
	methods = {
		'init': function(options){
			if( $.data(this, 'moreLess') ){
				// already initialized
				return;
			}
			var $this = $(this);
			$this.settings = $.extend({}, defaults, options);
			$this.settings.linkClass = $this.settings.linkClass ? ' ' + $this.settings.linkClass : '';
			$this.$linkContainer = internal.getSelector($this.settings.linkContainer) || $this;
			$this.more = $('<button type="button" class="btn btn-link more more'+$this.settings.linkClass+'">'+$this.settings.more+'</button>')
				.click(function(event){
					event.preventDefault();
					methods.more.call($this);
				}).hide();
			$this.less = $('<button type="button" class="btn btn-link less less'+$this.settings.linkClass+'">'+$this.settings.less+'</button>')
				.click(function(event){
					event.preventDefault();
					methods.less.call($this);
				}).hide();

			$this.$linkContainer.append( $this.more ).append( $this.less );
			
			$.data(this, 'moreLess', $this);
			methods[$this.settings.openByDefault ? 'more' : 'less'].call($this);
		},
		'destroy': function(){
			var $this = this;
			$this.more.remove();
			$this.less.remove();
		},
		'update': function(){
			var $this = this;
			if( $this.clipItems ){
				methods.less.call($this);
			}
		},
		'less': function(){
			var $this = this,
				$items = internal.items.call($this),
				$item,
				minItems = internal.getMinItems.call(this),
				numberToClip = $items.length - minItems;
			
			$this.less.hide();

			if( $this.settings.truncateText){
				// no childrent to clip, so default to 
				// text behavior
				$this.css({
					'white-space': 'nowrap',
					'overflow': 'hidden',
					'max-width': '100%',
					'display': 'inline-block',
					'text-overflow': 'ellipsis'
				});

				if( $this.settings.more )
					// $this.more.text( $this.settings.more ).show();
					$this.more.text( $this.settings.more ).css('display', '');

			}else if( numberToClip > 0 ){
				$items.each(function(itemIndex, item){
					$item = $(item);
					if( itemIndex === minItems - 1 ){
						$item.addClass('more-less-last');
					}else if( itemIndex >= minItems ){
						$item.hide();
					} 
				});
				if( $this.settings.more )
					// $this.more.text( numberToClip + ' ' + $this.settings.more ).show();
					$this.more.text( numberToClip + ' ' + $this.settings.more ).css('display', '');

				$this.clipItems = true;
			}
		},
		'more': function(){
			var $this = this,
				$items = internal.items.call($this),
				minItems = internal.getMinItems.call($this);
			

			if( $this.settings.truncateText ){
				// text behavior
				$this.css({
					'white-space': 'normal',
					'overflow': 'visible',
					'max-width': 'auto',
					'display': 'initial',
					'text-overflow': 'inherit'
				});
				// this.less.show();
				this.less.css('display', '');
				
			}else{
				// $items.removeClass('more-less-last').show();
				$items.removeClass('more-less-last').css('display', '');
				if( $items.length > minItems || $items.length === 0 ){
					if( $this.settings.less )
						// this.less.show();
						this.less.css('display', '');
					$this.clipItems = false;	
				}
			}
			
			$this.more.hide();
			
			
		},
		'toggle': function(){
			methods[this.clipItems ? 'more' : 'less'].call(this);
		}
	};
	var old = $.fn.moreless;
	$.fn.moreless = function(){
		var args = arguments;
		// loop through each element in selector
		$.each(this, function(){
			if( typeof args[0] === 'string' && typeof methods[args[0]] === 'function' ){
				// call api method
				var api = $.data(this, 'moreLess');
				if( api )
					methods[args[0]].apply(api, Array.prototype.splice(args, 1));
			}else if( typeof args[0] === 'object' || !args[0] ){
				// call init method
				methods.init.apply(this, args);
			}	
		});
		return this;
	};
	/* DROPDOWN NO CONFLICT
	 * ==================== */
	$.fn.moreless.noConflict = function(){
		$.fn.moreless = old;
		return this;
	};
  
})(jQuery);
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["editable"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "maxlength=\"";
  if (helper = helpers.textInputMaxLength) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.textInputMaxLength); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n<div class=\"bottom\">\r\n	<div>\r\n		<span role=\"label\">";
  if (helper = helpers.defaultValueLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.defaultValueLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>:<br/>\r\n		<strong>\"";
  if (helper = helpers.defaultValue) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.defaultValue); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"</strong>\r\n	</div>\r\n	<button role=\"button\" data-action=\"revert\" class=\"btn\">";
  if (helper = helpers.defaultButtonLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.defaultButtonLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\r\n</div>\r\n";
  return buffer;
  }

  buffer += "<label>";
  if (helper = helpers.newValueLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.newValueLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ":</label><input type=\"text\" placeholder=\"";
  if (helper = helpers.newValuePlaceholder) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.newValuePlaceholder); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.textInputMaxLength), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "></input>\r\n";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.currentValueIsDefault), {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  return buffer;
  });;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["facetlist"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		";
  return buffer;
  }
function program2(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\r\n			<li class=\"up-facet-option\" data-facet=\""
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-facet-option=\"";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\r\n				<span class=\"up-facet-option-name\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span><button role=\"button\" data-action=\"remove\" class=\"btn up-btn-close-x-small\">remove</button> \r\n			</li>\r\n			";
  return buffer;
  }

  buffer += "<div class=\"up-inner\">\r\n	<span role=\"label\">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n	<ul role=\"presentation\" class=\"up-facets\">\r\n		";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.facets), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	</ul>\r\n</div>";
  return buffer;
  });;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["filterpanel"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"up-filterpanel-header\">\r\n	<div class=\"pull-left\">\r\n		<span class=\"up-filterpanel-title pull-left\" title=\"";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.label) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.label); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n		<span class=\"up-filterpanel-result pull-left\"></span>\r\n	</div>\r\n	<div class=\"pull-right\">\r\n		<button role=\"button\" data-action=\"clear-all\" class=\"btn-link\" title=\"";
  if (helper = helpers.clearAllLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.clearAllLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.clearAllLabel) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.clearAllLabel); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</button>\r\n		<button data-action=\"close\" class=\"btn up-btn-close-x\">close</button>\r\n	</div>\r\n</div>\r\n<div class=\"up-selectlist\">";
  if (helper = helpers.selectlist) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.selectlist); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>";
  return buffer;
  });;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["hover_tooltip"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var stack1, helper, options, functionType="function", self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n";
  if (helper = helpers.content) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.content); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }

  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.tinyscrollbar) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.tinyscrollbar); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.tinyscrollbar) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { return stack1; }
  else { return ''; }
  });;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["selectlist"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	<ul role=\"presentation\" class=\"up-facets\">\r\n		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	</ul>\r\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n	  		<li role=\"facet\" class=\"up-facet\">\r\n	  			<div role=\"header\" class=\"up-facet-header\">\r\n			  		<span role=\"button\" data-action=\"toggle\"></span>\r\n			  		<span role=\"label\" data-value=\"";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"up-facet-label\">";
  if (helper = helpers.displayName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.displayName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\r\n		  		</div>\r\n		  		<ul role=\"group\" class=\"up-facet-options\">\r\n		  			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		  		</ul>\r\n		  	</li>\r\n		  	";
  stack1 = helpers.unless.call(depth0, (data == null || data === false ? data : data.last), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n  		";
  return buffer;
  }
function program3(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\r\n			  		<li class=\"up-facet-option\" data-facet=\""
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-facet-option=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">\r\n			  			<input data-facet=\""
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-facet-option=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" type=\"checkbox\">\r\n			  			<span class=\"up-facet-option-name\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span>\r\n			  		</li>\r\n			  		";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "	\r\n	  		<li class=\"divider\"></li>\r\n	  		";
  }

  buffer += "<div class=\"up-inner\">\r\n	";
  options={hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}
  if (helper = helpers.tinyscrollbar) { stack1 = helper.call(depth0, options); }
  else { helper = (depth0 && depth0.tinyscrollbar); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
  if (!helpers.tinyscrollbar) { stack1 = blockHelperMissing.call(depth0, stack1, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data}); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n</div>";
  return buffer;
  });;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["table"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, options, functionType="function", escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	<thead>\r\n		<tr>\r\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.headers), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		</tr>\r\n	</thead>\r\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n			<th>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</th>\r\n			";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\r\n	<tr class=\"";
  if (helper = helpers.stripe) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.stripe); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\r\n		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	</tr>\r\n	";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "";
  buffer += "\r\n		<td>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</td>\r\n		";
  return buffer;
  }

  buffer += "<table>\r\n	";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.headers), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	<tbody>\r\n	";
  stack1 = (helper = helpers.zebra || (depth0 && depth0.zebra),options={hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data},helper ? helper.call(depth0, (depth0 && depth0.rows), options) : helperMissing.call(depth0, "zebra", (depth0 && depth0.rows), options));
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n	</tbody>\r\n</table>\r\n";
  return buffer;
  });;