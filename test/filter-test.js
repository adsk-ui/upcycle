describe('filter', function(){
	var data = {
		'filters': [{
			'name': 'date',
			'displayName': 'Date',
			'values':[{
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
			'values':[{
				'name': 'high',
				'displayName': 'High'
			},{
				'name': 'low',
				'displayName': 'Low'
			}]
		}]
	};
	var $mocha = $('#mocha');
	var filter = window.filter = $mocha.filter({
		'data': data,
		'eventDelay': 1000
	}).data('Upcycle-filter');

	$mocha.on('filterchange', function(event, data){
		console.log(event);
		console.log(data);
	}).on('change', function(){
		console.log('changing...');
	});

	it('creates template context', function(){
		var context = $.Upcycle.filter.prototype._getTemplateContext.call(this, data);
		expect(context.filters instanceof Array).to.equal(true);
		expect(context.facetCount).to.equal(4);
		
		context = $.Upcycle.filter.prototype._getTemplateContext.call(this);
		expect(context.facetCount).to.equal(0);
	});

});