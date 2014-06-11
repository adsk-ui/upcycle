$.widget('upcycle.base', {
	'options':{
		'templatesNamespace': 'upcycle.templates',
		'templateName': '',
		'localizeLabels': true
	},
	'_create': function(){
		this.element.addClass(this.widgetFullName);
		this._setOptions(this.options);
	},
	'_getMarkup': function(){
		var template = this._getTemplate();
		return template(this._getTemplateContext.apply(this, arguments));
	},
	'_getTemplate': function(templateName){
		templateName = templateName || this.options.templateName;
		return eval(this.option('templatesNamespace'))[templateName || this.option('templateName')];
	}
});

$.upcycle.escapeForSelector = function(val){
	return typeof val === 'string' ? val.replace(/\\/, '\\\\') : val;
}