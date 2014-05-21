$.widget('upcycle.editpanel', $.upcycle.base, {
	'options':{
		'defaultElement': 'div',
		'editElement': null
	}, 
	'_create': function(){
		this._on({
			'change': this._onEditChange
		});
		this._render();
	},
	'_render': function(){
		this.element.html(this._getMarkup());
	},
	'_onEditChange': function(event){
		this._trigger(':value:change', event, {
			'newValue': event.target.value,
			'editElement': this.options.editElement 
		});
		this._trigger(':done', event);
	},
	'_getMarkup': function(){
		var template = upcycle.templates['editable-editpanel'];
		return template(this._getTemplateContext(this.options.editElement, this.options.localizeLabels));
	},
	'_getTemplateContext': function(editElement, localizeLabels){
		var context = {},
			newValueLabel, origValueLabel, newValuePlaceholder;
		if(editElement){
			newValueLabel = editElement.getAttribute('data-edit-new');
			origValueLabel = editElement.getAttribute('data-edit-og');
			newValuePlaceholder = editElement.getAttribute('data-edit-enter');
			context = {
				'newValueLabel': localizeLabels ? $.i18n.prop(newValueLabel) : newValueLabel,
				'origValueLabel': localizeLabels ? $.i18n.prop(origValueLabel) : origValueLabel,
				'newValuePlaceholder': localizeLabels ? $.i18n.prop(newValuePlaceholder) : newValuePlaceholder,
				'origValue': editElement.getAttribute('data-edit-og-value')
			};
		}
		return context;
	},
	'_destroy': function(){
		this.element.remove();
	}
});


$.widget('upcycle.editable', $.upcycle.base, {
	'options': {
		'editWidgetName': 'editpanel',
		'editWidgetContainer': null
	},
	'_create': function(){
		this._on({
			'click .editable': this._initEditWidget
		});
	},
	'_initEditWidget': function(event){
		var editWidgetName = this.options.editWidgetName,
			$container = this.options.editWidgetContainer ? $(this.options.editWidgetContainer) : this.element;
		
		this.editWidget = $.upcycle[this.options.editWidgetName]({
			'editElement': event.target
		});

		$container
			.on(this.editWidget.widgetEventPrefix+':value:change', this._updateTargetElement)
			.on(this.editWidget.widgetEventPrefix+':done', this._destroyEditWidget)
			.append(this.editWidget.element);

	},
	'_destroyEditWidget': function(){
		this.editWidget.destroy();
		this.editWidget = null;
	},
	'_updateTargetElement': function(event, data){
		$(data.editElement).html(data.newValue);
	}
});