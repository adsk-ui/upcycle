$.widget('upcycle.hover_tooltip', $.upcycle.base, {
	'options': {
		'templateName': 'hover_tooltip'
	},
	'_create': function(){
		var self = this;
		this._super();
		$('.hover_tooltip')
		// http://stackoverflow.com/questions/1273566/how-do-i-check-if-the-mouse-is-over-an-element-in-jquery/1670561#1670561
		.mouseenter(function (e) {
			clearTimeout($(this).data('timeoutId'));
		})
		.mouseleave(function (e) {
			e.stopImmediatePropagation();
			var $this = $(this),
				timeoutId = setTimeout(function () {
					self._close($this)
				}, 1000);
			$this.data('timeoutId', timeoutId);
		})
		.tooltip({
			items: '.hover_tooltip',
			content: function () {
				return self._getMarkup();
			}
		});
	},
	_close: function ($el) {
		$el.tooltip('close');
	},
	_getTemplateContext: function() {
		return {};
	}
});