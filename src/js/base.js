$.widget('upcycle.base', {
	'options':{
		'templates': 'upcycle.templates',
		'templateName': '',
		'localizeLabels': true
	},
	'_getMarkup': function(){
		var template = this._getTemplate();
		return template(this._getTemplateContext.apply(this, arguments));
	},
	'_getTemplate': function(){
		return eval(this.option('templates'))[this.option('templateName')];
	}
});