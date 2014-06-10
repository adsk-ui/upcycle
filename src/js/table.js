$.widget('upcycle.table', $.upcycle.base, {
	'options': {
		'scrollable': false,
		'sortable': true
	},
	'_create': function(){
		this._super();
		var $table = this.element,
			$dummyTable;
		if( this.options.scrollable ){
		/**
		 * Create a dummy table containing the visible header. This will
		 * allow the body of the real table to appear to scroll independently from 
		 * the visible header in the dummy.
		 * @type {[type]}
		 */
			$dummyTable = $('<table></table>')
				.append('<thead>'+$table.find('thead').html()+'</thead>')
				.append('<tbody><tr>'+$table.find('tbody tr').eq(0).html()+'</tr></tbody>')
				.insertBefore($table);

			// copy attributes to dummy table
			$.each($table[0].attributes, function(index, name){
				if( this.name !== 'id')
					$dummyTable.attr(this.name, this.value);
			});

			// hide the dummy from screen readers
			$dummyTable.attr('role', 'presentation');
			$dummyTable.attr('aria-hidden', 'true');

			// apply approriate class name to dummy
			$dummyTable.removeClass(this.widgetFullName);
			$dummyTable.addClass(this.widgetFullName+'-dummy');

			// denote this table as scrollable for styling
			$table.addClass('scrollable');

		}
		if( this.options.sortable ){
			// init tablesorter plugin
			$table.tablesorter(this.options);

			if(this.options.scrollable){
				// if the table is scrollable and sortable, we need
				// to set up the dummy to act as a proxy for clicks in the header
				$dummyTable.tablesorter(this.options)
					.find('th')
						.on('click', function(){
							var thIndex = $(event.currentTarget).index();
							$table.find('thead th').eq(thIndex).trigger('click');
						});
				// also need to proxy custom tablesorter events to dummy
				$table.on('sorton', function(event){
					var args = Array.prototype.slice.call(arguments, 1);
					args.unshift(event.type);
					$dummyTable.trigger.apply($dummyTable, args);
				});
			}
		}
	}
});