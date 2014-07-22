describe('hover_tooltip', function() {
	var $link = $('<a href="#" style="margin-left:200px;" class="hover_tooltip">hover here</a>');

	beforeEach(function() {
		$link.appendTo('#sandbox-inner').hover_tooltip_list({
			'widgetContainer': '#sandbox',
			// 'collection': ['Building Design Suite Premium', 'Infraworks'],
			'collection': ['Building Design Suite Premium', 'Infraworks', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum'],
			'hoverInContent': true,
			'placement': 'bottom',
			'template': null,
			'templateName': 'hover_tooltip_list'
		});
	});

	it('playing with hover_tooltip', function() {
		//todo
	});
});