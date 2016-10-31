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
        'thumbSize': 50,

        // position auto-adjustment options
        'overflowContainer': null,
        'alignTo': 'left',
        'edgeMargin': 0,
        'arrowPlacement': 'middle',
        'arrowMargin': 12
    },
    '_create': function(options){
        if (this.option('content') === null) throw new Error('No content provided');
        var self = this,
            $el = this.element,
            content = self.option('content'),
            id = new Date().getTime(),
            defaults = {bind: true};

        options = _.extend(defaults, options ? options : {});
        self._super();
        self.scrollable = self.option('maxHeight') !== null;
        self.option('id', 'tip_' + id);

        // Initialize popover
        $el.popover($.extend({}, self.options, {
            'content': function() {
                return self.scrollable ? self._getMarkup(content) : content;
            }
        }));

        if (!options.bind) {
            self._bindEvents();
        }
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
                var $content = $('.popover').find('.arrow, .popover-title, .popover-content');
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

        if (self.option('overflowContainer') && $(self.option('overflowContainer')).length) {
            self.posAutoAdjustment();
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
        var sb = this.element
            .data('popover').tip()
            .find('.scroll-area')
            .data('plugin_tinyscrollbar');
        if (sb !== undefined) {
            sb.update('relative');
        }
    },
    update: function(options) {
        var self = this,
            $el = this.element;
        $el.popover('destroy');
        self.option(options);
        self._create({bind: false});
    },
    posAutoAdjustment: function() {
        var self = this,
            $el = self.element,
            $overflowContainer = self.option('overflowContainer'),
            $container = $(self.option('container')),
            alignTo = self.option('alignTo') === 'right' ? 'right' : 'left',
            edgeMargin = self.option('edgeMargin'),
            arrowMargin = self.option('arrowMargin'),
            $tip = $el.data('popover').tip(),
            $arrow = $tip.find('.arrow'),
            arrowPlacement = self.option('arrowPlacement') === 'right' || self.option('arrowPlacement') === 'left' ? self.option('arrowPlacement') : 'middle';

        $el.on('hide', function () {
            $tip = $el.data('popover').tip();
            $arrow = $tip.find('.arrow');
            $tip.css({
                left: '',
                right: ''
            });
            $arrow.css({
                left: '',
                right: '',
                'margin-left': '',
                'margin-right': ''
            });
        });
        $el.on('show', function() {
            $el.data('popover').tip().attr('id', self.option('id'));
        });
        $el.on('shown', function () {
            $tip = $el.data('popover').tip();
            $arrow = $tip.find('.arrow');
            var origTipRect = $tip[0].getBoundingClientRect(),
                tipRect = _.clone(origTipRect),
                overflowContainerRect = $overflowContainer[0].getBoundingClientRect(),
                containerRect = $container[0].getBoundingClientRect(),
                arrowRect = $arrow[0].getBoundingClientRect(),
                tipHash,
                arrowHash,
                xShift;

            tipRect.right = tipRect.right + edgeMargin;
            tipRect.left = tipRect.left - edgeMargin;
            tipRect.width = tipRect.width + edgeMargin*2;

            // Change tip alignment
            if (alignTo === 'right') {
                tipHash = {
                    left: 'auto',
                    right: (containerRect.width - $tip.css('left').replace('px', '') - origTipRect.width) + 'px'
                };
                arrowHash = {
                    left: 'auto',
                    right: '50%',
                    'margin-left': 0,
                    'margin-right': '-11px'
                };
                $tip.css(tipHash);
                $arrow.css(arrowHash);
            }

            // Adjust placement only if either top xor bottom edge is inbound to avoid infinite loop using ^ (XOR)
            if ((tipRect.top >= overflowContainerRect.top ^ tipRect.bottom <= overflowContainerRect.bottom) && tipRect.height < overflowContainerRect.height) {
                if (tipRect.top < overflowContainerRect.top) { // tip overflows into the top
                    self.update({placement: 'bottom'});
                    $el.popover('show');
                } else if (tipRect.bottom > overflowContainerRect.bottom) {
                    self.update({placement: 'top'}); // tip overflows into the bottom
                    $el.popover('show');
                }
            } else if ((tipRect.left >= overflowContainerRect.left ^ tipRect.right <= overflowContainerRect.right) && tipRect.width < overflowContainerRect.width) { // Adjust placement only if either left xor right edge is inbound to avoid infinite loop using ^ (XOR)
                xShift = 0;
                tipHash = {};
                arrowHash = {};

                if (tipRect.left < overflowContainerRect.left) { // tip overflows into the left
                    xShift = overflowContainerRect.left - tipRect.left; // +
                } else if (tipRect.right > overflowContainerRect.right) { // tip overflows into the right
                    xShift = overflowContainerRect.right - tipRect.right; // -
                }
                xShift = xShift*(alignTo === 'right' ? -1 : 1); // adjust for sign change when aligning to right
                tipHash[alignTo] = '+=' + xShift;
                arrowHash[alignTo] = 'calc(50% - ' + xShift + 'px)';
                $tip.css(tipHash);
                $arrow.css(arrowHash);
            } else if (arrowPlacement !== 'middle' && tipRect.left >= overflowContainerRect.left && tipRect.right <= overflowContainerRect.right) { // Fallback to allow for arrowPlacement if no sides overflow
                var tipHalfWidth = origTipRect.width / 2 - arrowRect.width / 2 - arrowMargin,
                    gapWidth = arrowPlacement === 'left' ? overflowContainerRect.right - tipRect.right : tipRect.left - overflowContainerRect.left;
                xShift = (tipHalfWidth < gapWidth ? tipHalfWidth : gapWidth)*(arrowPlacement === 'right' ? -1 : 1)*(alignTo === 'right' ? -1 : 1);
                tipHash = {};
                arrowHash = {};

                tipHash[alignTo] = '+=' + xShift;
                arrowHash[alignTo] = 'calc(50% - ' + xShift + 'px)';
                $tip.css(tipHash);
                $arrow.css(arrowHash);
            }
        });
    }
});