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