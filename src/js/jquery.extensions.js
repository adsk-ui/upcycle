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
})(jQuery);