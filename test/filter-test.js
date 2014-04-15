describe('filter', function(){
	var data = {
		'facets': [{
			'name': 'date',
			'displayName': 'Date',
			'options':[{
				'name': 'today',
				'displayName': 'Today'
			},{
				'name': 'yesterday',
				'displayName': 'Yesterday',
				'selected': true
			}]
		},{
			'name': 'severity',
			'displayName': 'Severity',
			'options':[{
				'name': 'reallyhigh',
				'displayName': 'Really high'
			},{
				'name': 'high',
				'displayName': 'High'
			},{
				'name': 'notsohigh',
				'displayName': 'Not so high'
			},{
				'name': 'medium',
				'displayName': 'Medium'
			},{
				'name': 'mediumlow',
				'displayName': 'Medium low'
			},{
				'name': 'low',
				'displayName': 'Low'
			}]
		}]
	};
	var $sandbox = $('#sandbox');
	var filter = window.filter = $sandbox.filter({
		'data': data,
		'eventDelay': 1000
	}).data('Upcycle-filter');

	$sandbox.on('filterchange', function(event, data){
		console.log(event);
		console.log(data);
	}).on('change', function(){
		console.log('changing...');
	});

	describe('creates template context', function(){
		var context = $.Upcycle.filter.prototype._getTemplateContext.call(this, data);
		var context2 = $.Upcycle.filter.prototype._getTemplateContext.call(this);
		it('that includes facet array', function(){
			expect(context.facets instanceof Array).to.equal(true);
		});
		it('that includes facet count', function(){
			expect(context.facetCount).to.equal(2);	
		});
		it('that includes facet options count', function(){
			expect(context.facetValuesCount).to.equal(8);	
			expect(context2.facetCount).to.equal(0);
		});
		
		
	});

});