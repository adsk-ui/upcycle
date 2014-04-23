$.widget('upcycle.facetlist', {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'data': {},
		'eventDelay': 0
	},
	'appliedFilters': {},
	
	
	'_create': function(){
		this._setOptions(this.options);
		this._on({'change': this._onChange});
		
		this._on({'click [role="facet"] > [role="header"]': this._onToggle});
		this._on({'click button.more, button.less': this.update});
		this.element.addClass('facetlist'); 
		this._render();
	},
	'_render': function(){
		this.element
			.empty()
			.append(this._getMarkup(this.options.data));
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
		$viewport.find('.facet-options').each(function(){
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
		this.update();
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
		var template = eval(this.options.templatesNamespace)['facetlist'],
			templateContext = this._getTemplateContext(data);
		return template(templateContext);
	}
});
$.widget('upcycle.filter', {
	'options': {
		'templatesNamespace': 'upcycle.templates',
		'label': 'Filters',
		'clearAllLabel': 'Clear all',
		'resultsLabel': 'Results',
		'data': {}
	},
	'_create': function(){
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
		this.facetlist = this.element
			.empty()
			.append(this._getMarkup())
			.find('.facetlist')
				.facetlist({
					'data': this.options.data
				})
				.data('upcycle-facetlist');
		this.update();
	},
	'update': function(){
		this.facetlist.update();
	},
	'_getMarkup': function(){
		var filterMarkup = this._getTemplate('filter')(this.options);
		return filterMarkup;
	},
	'_getTemplate': function(name){
		return eval(this.options.templatesNamespace)[name];
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
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["facetlist"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<ul role=\"presentation\">\n		";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.facets), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</ul>\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n	  		<li role=\"facet\" class=\"facet\">\n	  			<div role=\"header\" class=\"facet-header\">\n			  		<span role=\"button\" data-action=\"toggle\" class=\"toggle\"></span>\n			  		<span role=\"label\" data-value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"facet-label\">";
  if (stack1 = helpers.displayName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.displayName); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n		  		</div>\n		  		<ul role=\"group\" class=\"facet-options\">\n		  			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		  		</ul>\n		  	</li>\n		  	";
  stack2 = helpers.unless.call(depth0, ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.last), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  		";
  return buffer;
  }
function program3(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n			  		<li class=\"facet-option\">\n			  			<input data-group=\""
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-facet=\"";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.name); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\" type=\"checkbox\"";
  stack2 = helpers['if'].call(depth0, (depth0 && depth0.selected), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ">\n			  			<span class=\"facet-option-name\">";
  if (stack2 = helpers.displayName) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.displayName); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</span>\n			  		</li>\n			  		";
  return buffer;
  }
function program4(depth0,data) {
  
  
  return " checked=\"true\"";
  }

function program6(depth0,data) {
  
  
  return "	\n	  		<li class=\"divider\"></li>\n	  		";
  }

  buffer += "<div class=\"inner\">\n	";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.tinyscrollbar) { stack1 = stack1.call(depth0, options); }
  else { stack1 = (depth0 && depth0.tinyscrollbar); stack1 = typeof stack1 === functionType ? stack1.call(depth0, options) : stack1; }
  if (!helpers.tinyscrollbar) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["filter"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"filter-header\">\n	<span class=\"filter-title\">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.label); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span><span class=\"result-count\"></span>\n	<button data-action=\"clear-all\" class=\"btn-link\">";
  if (stack1 = helpers.clearAllLabel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.clearAllLabel); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</button>\n</div>\n<div class=\"facetlist\"></div>";
  return buffer;
  });;