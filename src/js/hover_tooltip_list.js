$.widget('upcycle.hover_tooltip_list', $.upcycle.hover_tooltip, {
    'options': {
    	// default template
        'templateName': 'hover_tooltip_list',
        'collection': []
    },
    _create: function() {
        var $popover, $tip,
            $scrollArea, $viewport;

        $popover = this._super();

        // Scrollbar
        $popover.on('shown', function(e) {
            $tip = $popover.data('popover').tip();
            $scrollArea = $tip.find('.scroll-area');
            $viewport = $tip.find('.viewport');
            if ($viewport.prop('scrollHeight') > $viewport.prop('clientHeight')) {
                $scrollArea.tinyscrollbar();
            }
        })
    },
    _getTemplateContext: function() {
        return {
            items: this.option('collection')
        };
    }
});