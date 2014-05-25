$.widget('upcycle.editable', $.upcycle.base, {
	'options': {
		'templateName': 'editable',
		'popoverClass': '',
		'popoverContainer': null,
		'popoverPlacement': 'bottom',
		'defaultButtonLabel': 'EDITABLE_DEFAULT_BUTTON_LABEL'
	},
	'_create': function(){
		this._super();
		this._on({
			'click .editable': this._onEditOpen,
			'click [data-action="revert"]': this._onRevert
		});
	},
	'_onEditOpen': function(event){
		event.stopPropagation();
		this._render(event.currentTarget);
	},
	'_onEditChange': function(event, revert){
		var $targetElement = this.$targetElement,
			oldValue, newValue;
		if(revert && $targetElement.text() !== this.option('targetElementDefaultValue')){
			oldValue = $targetElement.text();
			newValue = this.option('targetElementDefaultValue');
		}else if(this.option('targetElementDefaultValue') !== event.target.value){
			oldValue = $targetElement.text();
			newValue = event.target.value;
		}
		if(newValue){
			$targetElement.text(newValue);

			this._trigger(':value:change', event, {
				'oldValue': oldValue,
				'newValue': newValue,
				'element': $targetElement[0],
				'revert': revert || false
			});
		}
		this._destroy();
	},
	'_onRevert': function(event){
		this._onEditChange(event, true);
	},
	'_render': function(targetElement){
		if(this.$targetElement && this.$targetElement[0] === targetElement)
			return;
		if(this.$targetElement)
			this._destroy();

		var $targetElement = this.$targetElement = $(targetElement),
			popoverClass = this.option('popoverClass');
		$targetElement
			.popover({
				'container': this.option('popoverContainer') || this.element,
				'html': true,
				'placement': this.option('popoverPlacement'),
				'content': this._getMarkup($targetElement)
			})
			.on('show', function(){
				var popover = $(this).data('popover');
				popover.tip()
					.addClass('editable-popover')
					.addClass(popoverClass);
			})
			.popover('show')
			.data('popover')
				.tip()
					.on('change', _.bind(this._onEditChange, this));
		this.option('targetElementDefaultValue', $targetElement.attr('data-default'));
	},
	'_destroy': function(){
		this.$targetElement.data('popover').tip().off();
		this.$targetElement.popover('destroy');
		this.$targetElement = null;
	},
	'_getTemplateContext': function($targetElement){
		var context = {},
			attr = _.bind($targetElement.attr, $targetElement),
			i18n = $.i18n.prop,
			localizeLabels = this.option('localizeLabels');
		if($targetElement){
			context = {
				'newValueLabel': localizeLabels ? i18n(attr('data-new-label')) : attr('data-new-label'),
				'newValuePlaceholder': localizeLabels ? i18n(attr('data-new-placeholder')) : attr('data-new-placeholder'),
				'defaultValueLabel': localizeLabels ? i18n(attr('data-default-label')) : attr('data-default-label'),
				'defaultValue': attr('data-default'),
				'defaultButtonLabel': localizeLabels ? i18n(this.option('defaultButtonLabel')) : this.option('defaultButtonLabel'),
				'currentValueIsDefault': attr('data-default') === $.trim($targetElement.text())
			};
		}
		return context;
	},
});