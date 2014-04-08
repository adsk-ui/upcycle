;(function($){
	"strict mode";
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
				$this.more = $('<a href="#" class="more'+$this.settings.linkClass+'">'+$this.settings.more+'</a>')
					.click(function(event){
						event.preventDefault();
						methods.more.call($this);
					}).hide();
				$this.less = $('<a href="#" class="less'+$this.settings.linkClass+'">'+$this.settings.less+'</a>')
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
})(jQuery);