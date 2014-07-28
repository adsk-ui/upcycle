// Generic tooltip triggered by mouse hover.
// Built on Bootstrap's popover.
$.widget('upcycle.hover_tooltip', $.upcycle.base, {
    'options': {
        // defaults
        'templateName': 'hover_tooltip',
        'triggerEvent': 'hover',
        'activatorTimeout': 300,
        'contentTimeout': 200,
        'animation': false,
        'html': true,
        'hoverInContent': false,
        'placement': 'right',
        'container': 'body',
        'classes': '', // customizable class
        'id': null,

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
            content = self.option('content'),
            id = new Date().getTime();

        self._super();
        self.scrollable = self.option('maxHeight') !== null;
        self.option('id', 'tip_' + id);

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
            'id': this.option('id'),
            'content': this.option('content')
        };
    },
    _bindEvents: function() {
        var self = this,
            $tip,
            scrollHeight,
            $scrollArea, $viewport, $overview,
            hoverable = self.option('triggerEvent') === 'hover';

        // When triggered by 'hover', turn off click
        // and provide delays on show/hide.
        if (hoverable) {
            self.element.off('click');
            self.element
            .on('mouseenter', function(e) {
                clearTimeout(self.hideDelay);
                if ($('#' + self.option('id')).is(':visible') === false) {
                    self.showDelay = setTimeout(function() {
                        self.element.popover('show');
                    }, 300);
                }
            })
            .on('mouseleave', function(e) {
                clearTimeout(self.showDelay);
                if (self.option('hoverInContent') === false) {
                    self.hideDelay = setTimeout(function() {
                        self._close();
                    }, 400);
                }
            });
        }

        // add classes during show event
        self.element
        .on('show', function() {
            $(this).data('popover').tip()
                .addClass(self.widgetFullName)
                .addClass(self.option('classes'));
        })
        // Hover in content timeout management,
        // and scrollbar initialization
        .on('shown', function() {
            if (self.option('hoverInContent') && hoverable) {
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

        if (self.option('hoverInContent') && hoverable) {
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
    },
    updateScrollbar: function() {
        self.element
            .data('popover').tip()
            .find('.scroll-area')
            .data('plugin_tinyscrollbar')
            .update('relative');
    }
});