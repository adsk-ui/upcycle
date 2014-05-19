$.widget('upcycle.editable.view', {
	'options':{

	}, 
	'_create': function(){
		this._render();
	},
	'_render': function(){
		this.element.html(this._getMarkup());
	},
	'_getMarkup': function(){
		var template = upcycle.templates['editable-view'];
		return template(this._getTemplateContext(this.options));
	},
	'_getTemplateContext': function(options){
		var context = {};
		return context;
	}
});
$.widget('upcycle.editable', {
	'options': {
		'view': 'upcycle.editable.view',
		'viewContainer': null
	},
	'_create': function(){
		this._on({
			'click .editable': this._onEdit,
			'change .editable': this._onEditChange
		});
	},
	'_onEdit': function(event){
		// $(event.currentTarget)
	},
	'_onEditChange': function(event){

	}
});