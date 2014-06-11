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