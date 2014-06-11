$.widget('upcycle.table', $.upcycle.base, {
	'options': {
		'scrollable': false,
		'sortable': true
	},
	'_create': function(){
		
		this._super();

		if( this.options.scrollable ){
			/**
			 * Create a dummy table containing the visible header. This will
			 * allow the body of the real table to appear to scroll independently from 
			 * the visible header in the dummy.
			 * @type {[type]}
			 */
			var _dummy = this._dummy = $('<table></table>').insertBefore(this.element);

			this._scrollarea = $(Handlebars.helpers.tinyscrollbar({fn:function(){}}))
				.insertBefore(this.element)
				.find('.overview')
					.html(this.element)
					.end()
				.tinyscrollbar();

			this._on(this._dummy, {
				'click th': function(event){
					this.element.find('thead th:eq('+$(event.currentTarget).index()+')')
						.trigger('click');
				}
			});
			// copy attributes to dummy table
			$.each(this.element[0].attributes, function(index, name){
				if( this.name !== 'id')
					_dummy.attr(this.name, this.value);
			});

			// hide the dummy from screen readers
			this._dummy.attr('role', 'presentation');
			this._dummy.attr('aria-hidden', 'true');

			// apply approriate class name to dummy
			this._dummy.removeClass(this.widgetFullName);
			this._dummy.addClass(this.widgetFullName+'-dummy');

			// denote this table as scrollable for styling
			this.element.addClass('scrollable');
			this._renderDummy();

		}
		if( this.options.sortable ){
			this.element.tablesorter(this.options);
			if(this._dummy){
				this._on({
					'sortEnd': this._renderDummy
				});
			}
		}
	},
	'update': function(){
		if(this._scrollarea){
			this._scrollarea.tinyscrollbar('update');
		}
	},
	'_renderDummy': function(){
		this._dummy.html('<thead>'+this.element.find('thead').html()+'</thead>');
	}
});