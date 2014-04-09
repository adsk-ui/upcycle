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
				'displayName': 'Yesterday'
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
	
	var filter = $('#mocha').filter({'data': data}).data('Upcycle-filter');

	it('exists', function(){
		expect($.fn.filter).to.be.a('function'); 
	});

});