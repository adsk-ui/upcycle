describe('hover_tooltip', function() {
    var $link = $('<a href="#" style="margin-left:200px;" class="hover_tooltip">hover here</a>');
    var longContent = '<ul>'+
                        '<li>first lorem ipsum</li>'+
                        '<li>second lorem ipsum</li>'+
                        '<li>third lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                        '<li>lorem ipsum</li>'+
                      '</ul>';

    beforeEach(function() {
        $link.appendTo('#sandbox-inner').hover_tooltip({
            'widgetContainer': '#sandbox',
            // 'collection': ['Building Design Suite Premium', 'Infraworks'],
            'collection': ['Building Design Suite Premium', 'Infraworks', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum'],
            'hoverInContent': true,
            'maxHeight': 215,
            'placement': 'bottom',
            // 'content': '<ul><li>first</li><li>second</li></ul>'
            'content': longContent
        });
    });

    it('playing with hover_tooltip', function() {
        //todo
    });
});