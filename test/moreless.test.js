describe('moreless', function(){
	it('has no conflict', function(){
		chai.expect($.fn.moreless.noConflict).to.be.a('function');
	});
	it('hides more items', function(){
		var $menu = $('<ul><li>hello</li><li>hi</li></ul>')
				.appendTo('#sandbox')
				.moreless({'minItems': 1});
		
		expect($menu.children('li:visible')).to.have.length(1);

		$menu.remove();
		$menu = $('<ul><li>hello</li><li>hi</li></ul>')
				.appendTo('#sandbox')
				.moreless({'minItems': 'same-y'});

		expect($menu.children('li:visible')).to.have.length(1);
		$menu.remove();
	});
});