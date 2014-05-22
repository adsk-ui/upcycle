$.widget('upcycle.editable', $.upcycle.base, {
	'options': {
		'templateName': 'editable-editpanel',
		'widgetName': 'editpanel',
		'widgetContainer': null,
		'widgetPlacement': 'bottom'
	},
	'_create': function(){
		this._on({
			'click .editable': this._onEditOpen
		});
		this.element.addClass(this.widgetFullName);
	},
	'_onEditOpen': function(event){
		event.stopPropagation();
		this._initWidget(event.currentTarget);
	},
	'_onEditChange': function(event){
		if(this.option('targetElementInitialValue') !== event.target.value){
			this._updateTargetElement(this.$targetElement, event.target.value);
			this._trigger(':value:change', event, {
				'oldValue': this.option('targetElementInitialValue'),
				'newValue': event.target.value,
				'targetElement': this.option('targetElement') 
			});
		}
		this._destroyWidget();
	},
	'_initWidget': function(targetElement){
		if(this.$targetElement && this.$targetElement[0] === targetElement)
			return;
		if(this.$targetElement)
			this._destroyWidget();

		var $targetElement = this.$targetElement = $(targetElement);
		$targetElement
			.popover({
				'container': this.option('widgetContainer') || this.element,
				'html': true,
				'placement': this.option('widgetPlacement'),
				'content': this._getMarkup($targetElement)
			})
			.popover('show')
			.data('popover')
				.tip()
					.on('change', _.bind(this._onEditChange, this));
		this.option('targetElementInitialValue', $targetElement.text());
	},
	'_destroyWidget': function(){
		this.$targetElement.data('popover').tip().off();
		this.$targetElement.popover('destroy');
		this.$targetElement = null;
	},
	'_updateTargetElement': function(targetElement, targetElementNewValue){
		targetElement.text(targetElementNewValue);
	},
	'_getTemplateContext': function($targetElement){
		var context = {},
			localizeLabels = this.option('localizeLabels'),
			newValueLabel, origValueLabel, newValuePlaceholder;
		if($targetElement){
			newValueLabel = $targetElement.attr('data-edit-new');
			origValueLabel = $targetElement.attr('data-edit-og');
			newValuePlaceholder = $targetElement.attr('data-edit-enter');
			context = {
				'newValueLabel': localizeLabels ? $.i18n.prop(newValueLabel) : newValueLabel,
				'origValueLabel': localizeLabels ? $.i18n.prop(origValueLabel) : origValueLabel,
				'newValuePlaceholder': localizeLabels ? $.i18n.prop(newValuePlaceholder) : newValuePlaceholder,
				'origValue': $targetElement.attr('data-edit-og-value')
			};
		}
		return context;
	},
});