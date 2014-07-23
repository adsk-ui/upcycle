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
		var templates = (function(){return this;})(),
			spaces = this.option('templatesNamespace').split('.');
		for (var i=0; i<spaces.length; i++) {
			if (_.has(templates, spaces[i])) {
				templates = templates[ spaces[i] ];
			}
			else {
				throw new Error(this.option('templatesNamespace') + ' not found');
			}
		}
		templateName = templateName || this.options.templateName;
		return templates[templateName || this.option('templateName')];
	},
	'_getLabel': function(label){
		return this.options.localizeLabels ?  $.i18n.prop( label ) : label;
	}
});

$.upcycle.escapeForSelector = function(val){
	return typeof val === 'string' ? val.replace(/\\/, '\\\\') : val;
};