$.widget('Upcycle.filter', {
	'options': {
		'templatesNamespace': 'Upcycle.templates',
		'data': {}
	},
	'_create': function(){
		this.element.append(this._getTemplate('filter')(this.options.data));
	},
	'_getTemplate': function(name){
		return eval(this.options.templatesNamespace)[name];
	}
});