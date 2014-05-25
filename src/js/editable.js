$.widget('upcycle.editable', $.upcycle.base, {
	'options': {
		'templateName': 'editable',
		'textSelector': '',
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
			defaultValue = this.option('targetElementDefaultValue'),
			oldValue = this._getTargetElementText(), 
			newValue = revert ? defaultValue : event.target.value;
		revert = defaultValue === newValue;
		if(oldValue !== newValue){
			$targetElement.attr('data-default', revert ? null : defaultValue);
			this._setTargetElementText(newValue);
			this._trigger(':value:change', event, {
				'oldValue': oldValue,
				'newValue': newValue,
				'element': $targetElement[0],
				'revert': revert
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
			widgetFullName = this.widgetFullName,
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
					.addClass(widgetFullName+'-popover')
					.addClass(popoverClass);
			})
			.addClass('editing')
			.popover('show')
			.data('popover')
				.tip()
					.on('change', _.bind(this._onEditChange, this));
		this.option('targetElementDefaultValue', $targetElement.attr('data-default') || this._getTargetElementText());
	},
	'_destroy': function(){
		delete this.options.targetElementDefaultValue;
		this.$targetElement.removeClass('editing');
		this.$targetElement.data('popover').tip().off();
		this.$targetElement.popover('destroy');
		this.$targetElement = null;
	},
	'_getTargetElementText': function(){
		var $targetElement = this.$targetElement,
			text = '';
		if($targetElement){
			text = this.option('textSelector') ? 
				$targetElement.find(this.option('textSelector')).text() : 
					$targetElement.text();
		}
		return $.trim(text);
	},
	'_setTargetElementText': function(text){
		var $targetElement = this.$targetElement;
		if($targetElement){
			this.option('textSelector') ? 
				$targetElement.find(this.option('textSelector')).text(text) : 
					$targetElement.text(text);
		}
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
				'currentValueIsDefault': _.isEmpty(attr('data-default'))
			};
		}
		return context;
	},
});