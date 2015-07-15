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
		},
		parameterizeLabel: function(options){
			var $this = this,
				rawLabel = $this.settings[options.label];

			options = options || {};

			if(rawLabel && !rawLabel.match(/\{\d\}/) && options.params){
				rawLabel = '{0} ' + rawLabel;
			}

			return (rawLabel || '').replace(/\{(\d)\}/g, function(match, digit){
				digit = parseInt(digit, 10);
				return options.params && options.params.length > digit ? options.params[digit] : m;
			});
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
			$this.more = $('<button type="button" class="btn btn-link more more'+$this.settings.linkClass+'">'+'</button>')
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
					$this.more.text( internal.parameterizeLabel.call($this, {
						label: 'more',
						params: [numberToClip]
					})).css('display', '');

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