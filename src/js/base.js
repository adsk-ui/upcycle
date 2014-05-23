$.widget('upcycle.base', {
	'options':{
		'templatesNamespace': 'upcycle.templates',
		'templateName': '',
		'localizeLabels': true
	},
	'_create': function(){
		this.element.addClass(this.widgetFullName);
	},
	'_getMarkup': function(){
		var template = this._getTemplate();
		return template(this._getTemplateContext.apply(this, arguments));
	},
	'_getTemplate': function(templateName){
		return eval(this.option('templatesNamespace'))[templateName || this.option('templateName')];
	}
});