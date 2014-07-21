$.widget('upcycle.hover_tooltip', $.upcycle.base, {
    'options': {
        'templateName': 'hover_tooltip',
        'collection': null,
        'activatorTimeout': 300,
        'contentTimeout': 150,
        'hoverInContent': false,
        'placement': null,
        'prefix': null,
        'id': null
    },
    '_create': function(){
        var self = this,
            $el = this.element;
        this._super();

        // Initialize popover
        $el.popover({
            'animation': false,
            'placement': self.option('placement'),
            'html': true,
            'container': 'body',
            'content': function () {
                return self._getMarkup();
            }
        })
        .hoverInContent($el, this.option('activatorTimeout'), self._close)
        .on('shown', function() {
            var $content = $('#' + self.option('prefix') + '-' + self.option('id')).parent();
            $content.add( $content.siblings('.arrow') )
                .hoverInContent($el, self.option('contentTimeout'), self._close);
        });

        this._on({
            'mouseenter': function (e) {
                $el.popover('show');
            },
            'mouseleave': function () {
                $el.popover('hide');
            }
        });
    },
    _close: function () {
        this.popover('hide');
    },
    _getTemplateContext: function() {
        return {
            id: this.option('id'),
            products: this.option('collection')
        };
    }
});