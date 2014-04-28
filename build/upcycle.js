$.widget('upcycle.filter', {
	'defaultElement': '<div>',
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'label': 'Filters',
		'clearAllLabel': 'Clear all',
		'resultsLabel': 'Results',
		'resultLabel': 'Result',
		'data': [],
		'facets': [],
		'selectedFacets': [],
		'searchQuery': '',
		'eventDelay': 0
	},
	'_create': function(){
		this._setOptions(this.options);
		this._on({'click [data-action="clear-all"]': this.clear});
		this._on({'selectlistchange': this._onFilterChange});
		this.element.addClass('up-filter');
		this._render();
	},
	/**
	 * Clears all checkboxes (deselects all filters)		
	 * @return {jQuery} A jQuery object containing the element associated to this widget
	 */
	'clear': function(){
		this.element.find('[type="checkbox"]').each(function(index, checkbox){
			checkbox.checked = false;
		}).trigger('change');
		return this.element;
	},
	'update': function(){
		this.selectlist.update();
	},
	'search': function(query){

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
			selectedFacets = this.options.selectedFacets;
		if(!_.isEmpty(this.options.data)){
			filteredData = _(this.options.data)
				.chain()
				.filter(function(obj){
					return _(selectedFacets).every(function(values, facetName){
						return _(values).some(function(value){
							return obj[facetName] === value;
						});
					});
				})
				.value();
		}
		this.option('filteredDataLength', filteredData.length);
		this._trigger('change', event, {
			'selectedFacets': this.options.selectedFacets,
			'filteredData': filteredData
		});
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
		if(key === 'filteredDataLength'){
			var resultCount = '',
				resultCountLabel;
			if(!_.isEmpty(this.options.selectedFacets)){
				resultCountLabel = value == 1 ? this.options.resultLabel : this.options.resultsLabel;
				resultCount = $.i18n.prop(resultCountLabel, value);
			} 
			this.element.find('.up-filter-header .up-filter-result').text(resultCount);
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
(function($){

	var defaults = {
		'openByDefault': false,
		'minItems': 2,
		'itemClass': '',
		'more': 'More',
		'less': 'Less',
		'linkContainer': null,
		'linkClass': ''
	},
	internal = {
		'items': function(){
			var $this = this;
			return $this.settings.itemClass ? $this.find('.' + $this.settings.itemClass) : $this.children().not('.less, .more');
		},
		'getSelector': function(obj){
			return obj ? obj instanceof jQuery ? obj : $(obj) : null;
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
			$this.more = $('<button class="btn-link more'+$this.settings.linkClass+'">'+$this.settings.more+'</button>')
				.click(function(event){
					event.preventDefault();
					methods.more.call($this);
				}).hide();
			$this.less = $('<button class="btn-link less'+$this.settings.linkClass+'">'+$this.settings.less+'</button>')
				.click(function(event){
					event.preventDefault();
					methods.less.call($this);
				}).hide();

			$this.$linkContainer.append( $this.more ).append( $this.less );
			
			$.data(this, 'moreLess', $this);
			methods[$this.settings.openByDefault ? 'more' : 'less'].call($this);
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
				numberToClip = $items.length - $this.settings.minItems;
			
			$this.less.hide();
			
			if( numberToClip > 0 ){
				$items.each(function(itemIndex, item){
					$item = $(item);
					if( itemIndex === $this.settings.minItems - 1 ){
						$item.addClass('more-less-last');
					}else if( itemIndex >= $this.settings.minItems ){
						$item.hide();
					} 
				});
				if( $this.settings.more )
					$this.more.text( numberToClip + ' ' + $this.settings.more ).show();
					// $this.$linkContainer.append($this.more.text( numberToClip + ' ' + $this.settings.more ));	
				$this.clipItems = true;
			}
		},
		'more': function(){
			var $this = this,
				$items = internal.items.call($this);
			$items
				.removeClass('more-less-last')
				.show();
			
			$this.more.hide();
			
			if( $items.length > $this.settings.minItems ){
				if( $this.settings.less )
					this.less.show();
					// $this.$linkContainer.append($this.less);
				$this.clipItems = false;	
			}
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
				$facetOptions.moreless();
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
				var group = this.getAttribute('data-group'),
					facet = this.getAttribute('data-facet');	
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
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["filter"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"up-filter-header\">\n	<span class=\"up-filter-title\">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.label); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span><span class=\"up-filter-result\"></span>\n	<button role=\"button\" data-action=\"clear-all\" class=\"btn-link\">";
  if (stack1 = helpers.clearAllLabel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.clearAllLabel); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</button>\n</div>\n<div class=\"up-selectlist\"></div>";
  return buffer;
  });;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["selectlist"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<ul role=\"presentation\" class=\"up-facets\">\n		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</ul>\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n	  		<li role=\"facet\" class=\"up-facet\">\n	  			<div role=\"header\" class=\"up-facet-header\">\n			  		<span role=\"button\" data-action=\"toggle\"></span>\n			  		<span role=\"label\" data-value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"up-facet-label\">";
  if (stack1 = helpers.displayName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.displayName); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n		  		</div>\n		  		<ul role=\"group\" class=\"up-facet-options\">\n		  			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		  		</ul>\n		  	</li>\n		  	";
  stack2 = helpers.unless.call(depth0, ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.last), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  		";
  return buffer;
  }
function program3(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n			  		<li class=\"up-facet-option\">\n			  			<input data-group=\""
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-facet=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" type=\"checkbox\">\n			  			<span class=\"up-facet-option-name\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span>\n			  		</li>\n			  		";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "	\n	  		<li class=\"divider\"></li>\n	  		";
  }

  buffer += "<div class=\"up-inner\">\n	";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.tinyscrollbar) { stack1 = stack1.call(depth0, options); }
  else { stack1 = (depth0 && depth0.tinyscrollbar); stack1 = typeof stack1 === functionType ? stack1.call(depth0, options) : stack1; }
  if (!helpers.tinyscrollbar) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });;