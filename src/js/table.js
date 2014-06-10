$.widget('upcycle.table', $.upcycle.base, {
	'options': {
		'scrollable': false,
		'sortable': true
	},
	'_create': function(){
		this._super();
		if( this.options.sortable ){
			this.element.tablesorter(this.options);
		}
		if( this.options.scrollable ){
			var $theadClone = this.element.find('thead').clone(true, true),
				$tableClone = $('<table></table>').prepend($theadClone).insertBefore(this.element);

			// copy attributes to dummy table
			$.each(this.element[0].attributes, function(index, name){
				if( this.name !== 'id')
					$tableClone.attr(this.name, this.value);
			});

			$tableClone.attr('role', 'presentation');
			$tableClone.attr('aria-hidden', 'true');

			this.element.addClass('scrollable');
		}
	}
});