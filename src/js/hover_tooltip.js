// Generic tooltip triggered by mouse hover.
// Built on Bootstrap's popover.
$.widget('upcycle.hover_tooltip', $.upcycle.base, {
    'options': {
        // defaults
        'templateName': 'hover_tooltip',
        'activatorTimeout': 300,
        'contentTimeout': 150,
        'showDelay': 250,
        'animation': false,
        'html': true,
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
            content = self.option('content');

        self._super();
        self.scrollable = self.option('maxHeight') !== null;

        // Initialize popover
        $el.popover($.extend({}, self.options, {
            'content': function() {
                return self.scrollable ? self._getMarkup(content) : content;
            }
        }));

        self._bindEvents();
    },
    _close: function() {
        this.element.popover('hide');
    },
    _getTemplateContext: function() {
        return {
            'content': this.option('content')
        };
    },
    _bindEvents: function() {
        var self = this,
            $tip,
            scrollHeight,
            $scrollArea, $viewport, $overview;

        this.element
        .on('mouseenter', function(e) {
            if ($(self.option('container')).find('.popover:visible').length === 0) {
                self.showDelay = setTimeout(function() {
                    self.element.popover('show');
                }, self.option('showDelay'));
            }
        })
        .on('mouseleave', function(e) {
            clearTimeout(self.showDelay);
        })
        .on('show', function() {
            $(this).data('popover').tip()
                .addClass(self.widgetFullName)
                .addClass(self.option('classes'));
        })
        .on('shown', function() {
            if (self.option('hoverInContent')) {
                var $content = $('.popover').find('.arrow, .popover-content');
                self.hoverInContent(self.option('contentTimeout'), $content);
            }
            // Scrollbar
            if (self.scrollable) {
                $tip = self.element.data('popover').tip();
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
            self.hoverInContent(this.option('activatorTimeout'));
        }
    },
    // http://stackoverflow.com/questions/1273566/how-do-i-check-if-the-mouse-is-over-an-element-in-jquery/1670561#1670561
    /**
     * Allows the mouse to enter popover content without
     * closing the popover.
     * Stores the timeoutId in the triggering element.
     * Invokes the callback provided once setTimeout executes.
     */
    hoverInContent: function(timeout, $content) {
        var self = this,
            $el = ($content !== undefined) ? $content : self.element;

        $el.mouseenter(function (e) {
            clearTimeout(self.element.data('timeoutId'));
        })
        .mouseleave(function (e) {
            e.stopImmediatePropagation();
            var timeoutId = setTimeout(function () {
                    self._close();
                }, timeout);
            self.element.data('timeoutId', timeoutId);
        });
    }
});