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

        if (options.bind) {
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
            placement = self.option('placement'),
            dirHash = placement === 'top' || placement === 'bottom' ? { // to implement the symmetric left and right placed tooltip cases
                top: 'top',
                bottom: 'bottom',
                left: 'left',
                right: 'right',
                height: 'height',
                width: 'width'
            } : {
                top: 'left',
                bottom: 'right',
                left: 'top',
                right: 'bottom',
                height: 'width',
                width: 'height'
            },
            $overflowContainer = self.option('overflowContainer'),
            $container = $(self.option('container')),
            alignTo = self.option('alignTo') === dirHash.right ? dirHash.right : dirHash.left,
            edgeMargin = self.option('edgeMargin'),
            arrowMargin = self.option('arrowMargin'),
            $tip = $el.data('popover').tip(),
            $arrow = $tip.find('.arrow'),
            arrowPlacement = self.option('arrowPlacement') === dirHash.right || self.option('arrowPlacement') === dirHash.left ? self.option('arrowPlacement') : 'middle';

        $el.on('hide', function () {
            $tip = $el.data('popover').tip();
            $arrow = $tip.find('.arrow');
            var tipHash = {},
                arrowHash = {};
            tipHash[dirHash.left] = '';
            tipHash[dirHash.right] = '';
            arrowHash[dirHash.left] = '';
            arrowHash[dirHash.right] = '';
            arrowHash['margin-' + dirHash.left] = '';
            arrowHash['margin-' + dirHash.right] = '';
            $tip.css(tipHash);
            $arrow.css(arrowHash);
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
                elRect = $el[0].getBoundingClientRect(),
                arrowRect = $arrow[0].getBoundingClientRect(),
                placement = self.option('placement'),
                tipHash = {},
                arrowHash = {},
                xShift;

            tipRect[dirHash.right] = tipRect[dirHash.right] + edgeMargin;
            tipRect[dirHash.left] = tipRect[dirHash.left] - edgeMargin;
            tipRect[dirHash.width] = tipRect[dirHash.width] + edgeMargin*2;

            // Change tip alignment
            if (alignTo === dirHash.right) {
                tipHash[dirHash.left] = 'auto';
                tipHash[dirHash.right] = (containerRect[dirHash.width] - $tip.css(dirHash.left).replace('px', '') - origTipRect[dirHash.width]) + 'px';
                arrowHash[dirHash.left] = 'auto';
                arrowHash[dirHash.right] = '50%';
                arrowHash['margin-' + dirHash.left] = 0;
                arrowHash['margin-' + dirHash.right] = '-11px';
                $tip.css(tipHash);
                $arrow.css(arrowHash);
            }

            // Adjust placement only if either top xor bottom edge is inbound to avoid infinite loop using ^ (XOR)
            if ((tipRect[dirHash.top] >= overflowContainerRect[dirHash.top] ^ tipRect[dirHash.bottom] <= overflowContainerRect[dirHash.bottom]) && (tipRect[dirHash.height] + arrowRect[dirHash.height]) < overflowContainerRect[dirHash.height]) {
                if (tipRect[dirHash.top] < overflowContainerRect[dirHash.top] && placement === dirHash.top && (tipRect[dirHash.height] + arrowRect[dirHash.height]) < (overflowContainerRect[dirHash.bottom] - elRect[dirHash.bottom])) { // tip overflows into the top
                    self.update({placement: dirHash.bottom});
                    $el.popover('show');
                } else if (tipRect[dirHash.bottom] > overflowContainerRect[dirHash.bottom] && placement === dirHash.bottom && (tipRect[dirHash.height] + arrowRect[dirHash.height]) < (elRect[dirHash.top] - overflowContainerRect[dirHash.top])) {
                    self.update({placement: dirHash.top}); // tip overflows into the bottom
                    $el.popover('show');
                }
            } else if ((tipRect[dirHash.left] >= overflowContainerRect[dirHash.left] ^ tipRect[dirHash.right] <= overflowContainerRect[dirHash.right]) && tipRect[dirHash.width] < overflowContainerRect[dirHash.width]) { // Adjust placement only if either left xor right edge is inbound to avoid infinite loop using ^ (XOR)
                xShift = 0;
                tipHash = {};
                arrowHash = {};

                if (tipRect[dirHash.left] < overflowContainerRect[dirHash.left]) { // tip overflows into the left
                    xShift = overflowContainerRect[dirHash.left] - tipRect[dirHash.left]; // +
                } else if (tipRect[dirHash.right] > overflowContainerRect[dirHash.right]) { // tip overflows into the right
                    xShift = overflowContainerRect[dirHash.right] - tipRect[dirHash.right]; // -
                }
                xShift = xShift*(alignTo === dirHash.right ? -1 : 1); // adjust for sign change when aligning to right
                tipHash[alignTo] = '+=' + xShift;
                arrowHash[alignTo] = 'calc(50% - ' + xShift + 'px)';
                $tip.css(tipHash);
                $arrow.css(arrowHash);
            } else if (arrowPlacement !== 'middle' && tipRect[dirHash.left] >= overflowContainerRect[dirHash.left] && tipRect[dirHash.right] <= overflowContainerRect[dirHash.right]) { // Fallback to allow for arrowPlacement if no sides overflow
                var tipHalfWidth = origTipRect[dirHash.width] / 2 - arrowRect[dirHash.width] / 2 - arrowMargin,
                    gapWidth = arrowPlacement === dirHash.left ? overflowContainerRect[dirHash.right] - tipRect[dirHash.right] : tipRect[dirHash.left] - overflowContainerRect[dirHash.left];
                xShift = (tipHalfWidth < gapWidth ? tipHalfWidth : gapWidth)*(arrowPlacement === dirHash.right ? -1 : 1)*(alignTo === dirHash.right ? -1 : 1);
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