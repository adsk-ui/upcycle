describe('hover_tooltip', function() {
	var $link = $('<a href="#" style="margin-left:200px;" class="hover_tooltip">hover here</a>');

	beforeEach(function() {
		$link.appendTo('#sandbox-inner').hover_tooltip({
			'widgetContainer': '#sandbox',
			'collection': ['Building Design Suite Premium', 'Infraworks'],
			'hoverInContent': true,
			'prefix': 'product_list',
			'id': 'abc123',
			'placement': 'right'
		});
	});

	it('playing with hover_tooltip', function() {
		//todo
	});
});