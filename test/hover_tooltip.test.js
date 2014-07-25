describe('hover_tooltip', function() {
    var $link = $('<a href="#" style="margin-left:200px;">hover here</a>');
    var tooltip;
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
        tooltip = $link.appendTo('#sandbox-inner').hover_tooltip({
            'container': '#sandbox',
            'hoverInContent': true,
            'maxHeight': 215,
            'placement': 'bottom',
            'class': 'custom',
            // 'content': '<ul><li>first</li><li>second</li></ul>'
            'content': longContent
        }).data('upcycle-hover_tooltip');
    });
    afterEach(function() {
        tooltip._close();
        tooltip.element.remove();
        $link.off();
    });

    it('should have a scrollbar when maxHeight is set and overview content height is greater than maxHeight', function(done) {
        $link.click(function() {
            var tip = tooltip.element.data('popover').tip();
            expect(tip.find('.scrollbar').length).to.equal(1);
            expect(tip.find('.scrollbar').hasClass('disable')).to.equal(false);
            done();
        });
        $link.trigger('click');
    });
    it('should have a custom class', function(done) {
        $link.click(function() {
            expect(tooltip.element.hasClass('custom')).to.equal(false);
            done();
        });
        $link.trigger('click');
    });
});