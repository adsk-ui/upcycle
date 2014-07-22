// Generic tooltip triggered by mouse hover.
// Built on Bootstrap's popover.
$.widget('upcycle.hover_tooltip', $.upcycle.base, {
    'options': {
    	// default template
        'templateName': 'hover_tooltip',
        // or define your own Handlebars template
        'template': null,
        'activatorTimeout': 300,
        'contentTimeout': 150,
        'hoverInContent': false,
        'placement': 'right',
        'content': null,
        'prefix': null,
        'id': null,
        'class': ''
    },
    '_create': function(){
        var self = this,
            $el = this.element;
        this._super();

        // Initialize popover
        $popover = $el.popover({
            'animation': false,
            'placement': self.option('placement'),
            'html': true,
            'container': 'body',
            'content': function () {
            	// if content was already rendered and passed in, use it
            	// otherwise use the template assigned to the widget
                return self.option('content') !== null ? self.option('content') : self._getMarkup();
            }
        })
        .on('show', function() {
        	$(this).data('popover').tip().addClass(self.widgetFullName);
        })
        .on('shown', function() {
            if (self.option('hoverInContent')) {
                var $content = $('.popover').find('.arrow, .popover-content');
                $content.hoverInContent($el, self.option('contentTimeout'), self._close);
            }
        });

        if (self.option('hoverInContent')) {
            $el.hoverInContent($el, this.option('activatorTimeout'), self._close);
        }

        this._on({
            'mouseenter': function (e) {
                $el.popover('show');
            },
            'mouseleave': function () {
                $el.popover('hide');
            }
        });
        
        return $popover;
    },
    _close: function () {
        this.popover('hide');
    },
    _getTemplateContext: function() {
        return {};
    }
});