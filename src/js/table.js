$.widget('upcycle.table', $.upcycle.base, {
	'options': {
		'templateName': 'table',
		'templateContext': {},
		'scrollable': false,
		'sortable': true
	},
	'_init': function(){
		this._render();
	},
	'_render': function(){

		this._table = this._createTable();

		if( this.options.sortable && this.options.scrollable ){
			this._dummy = this._createDummy( this._table );
			this.element.html(this._dummy);
			this._renderDummy();
		}else{
			// this._destroyDummy( this._table );
		}

		if( this.options.sortable ){
			this._on(this._table, {
				'sortEnd': this._renderDummy
			});
			this._table.tablesorter(this.options);
		}

		if( this.options.scrollable ){
			this._scrollarea = this._createScrollArea();	
			this._scrollarea
				.find('.overview')
					.html(this._table)
					.end()
				.tinyscrollbar();
			this.element
				.addClass('scrollable')
				.append(this._scrollarea);
		}else{
			this.element.append(this._table);
			// this._destroyScrollArea();
		}

		this.update();
	},
	'_createTable': function(){
		return this._table || $((this._getTemplate())(this.options.templateContext));
	},
	'_createDummy': function( _table ){
		var _dummy = this._dummy;
		if( !_dummy ){
			/**
			 * Create a dummy table containing the visible header. This will
			 * allow the body of the real table to appear to scroll independently from 
			 * the visible header in the dummy.
			 * @type {[type]}
			 */
			_dummy = $('<table></table>');

			this._on(_dummy, {
				'click th': function(event){
					_table.find('thead th:eq('+$(event.currentTarget).index()+')')
						.trigger('click');
				}
			});
			// copy attributes to dummy table
			$.each(_table[0].attributes, function(index, name){
				if( this.name !== 'id')
					_dummy.attr(this.name, this.value);
			});

			// hide the dummy from screen readers
			_dummy.attr('role', 'presentation');
			_dummy.attr('aria-hidden', 'true');

			// apply approriate class name to dummy
			_dummy.removeClass(this.widgetFullName);
			_dummy.addClass('dummy');
		}
		return _dummy;
	},
	'_renderDummy': function(){
		this._dummy.html('<thead>'+this._table.find('thead').html()+'</thead>');
	},
	'_destroyDummy': function(){

	},
	'_createScrollArea': function(){
		return this._scrollarea || $(Handlebars.helpers.tinyscrollbar({fn:function(){}})).tinyscrollbar();
	},
	'_destroyScrollArea': function(){

	},
	'update': function(){
		if(this._scrollarea){
			this._scrollarea.data('plugin_tinyscrollbar').update();
		}
	},
});