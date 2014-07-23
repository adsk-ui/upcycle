// Generic tooltip triggered by mouse hover.
// Built on Bootstrap's popover.
$.widget('upcycle.hover_tooltip', $.upcycle.base, {
    'options': {
        // defaults
        'templateName': 'hover_tooltip',
        'activatorTimeout': 300,
        'contentTimeout': 150,
        'hoverInContent': false,
        'placement': 'right',
        'container': 'body',
        'classes': '', // customizable class

        // Required
        'content': null,

        // scrollbar options
        'maxHeight': null,
        'thumbSize': 50
    },
    '_create': function(){
        if (this.option('content') === null) throw new Error('No content provided');
        var self = this,
            $el = this.element,
            $popover, $tip,
            scrollable = self.option('maxHeight') !== null,
            scrollHeight,
            $scrollArea, $viewport, $overview;

        this._super();

        // Initialize popover
        $popover = $el.popover({
            'animation': false,
            'placement': self.option('placement'),
            'html': true,
            'container': self.option('container'),
            'content': function () {
                return scrollable ?
                            self._getMarkup(self.option('content')) :
                            self.option('content');
            }
        })
        .on('show', function() {
            $(this).data('popover').tip()
                .addClass(self.widgetFullName)
                .addClass(self.option('classes'));
        })
        .on('shown', function() {
            if (self.option('hoverInContent')) {
                var $content = $('.popover').find('.arrow, .popover-content');
                $content.hoverInContent($el, self.option('contentTimeout'), self._closeFromTriggerElement);
            }
            // Scrollbar
            if (scrollable) {
                $tip = $popover.data('popover').tip();
                $tip.find('.popover-content').css('max-height', self.option('maxHeight')+'px');

                $scrollArea = $tip.find('.scroll-area');
                $viewport = $tip.find('.viewport');
                $overview = $tip.find('.overview');
                scrollHeight = $overview.height();

                if (scrollHeight > self.option('maxHeight')) {
                    $viewport.height(self.option('maxHeight'));
                    $scrollArea.tinyscrollbar({
                        thumbSize: self.option('thumbSize')
                    });
                }
                else {
                    $viewport.height(scrollHeight);
                }
            }
        });

        if (self.option('hoverInContent')) {
            $el.hoverInContent($el, this.option('activatorTimeout'), self._closeFromTriggerElement);
        }

        this._on({
            'mouseenter': function (e) {
                $el.popover('show');
            },
            'mouseleave': function () {
                $el.popover('hide');
            }
        });
    },
    _closeFromTriggerElement: function () {
        this.popover('hide');
    },
    close: function() {
    	this.element.popover('hide');
    },
    _getTemplateContext: function() {
        return {
            'content': this.option('content')
        };
    }
});