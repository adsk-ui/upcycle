describe('selectlist', function(){
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
		},{
			'name': 'type',
			'displayName': 'Type',
			'options':[{
				'name': 'hotfix',
				'displayName': 'Hotfix'
			},{
				'name': 'coldfix',
				'displayName': 'Coldfix'
			},{
				'name': 'warmfix',
				'displayName': 'Warmfix'
			}]
		}]
	};
	
	describe('creates template context', function(){
		
		// it('that includes facet array', function(){
		// 	expect(context.facets instanceof Array).to.equal(true);
		// });
		// it('that includes facet count', function(){
		// 	expect(context.facetCount).to.equal(3);	
		// });
		// it('that includes facet options count', function(){
		// 	expect(context.facetValuesCount).to.equal(11);	
		// 	expect(context2.facetCount).to.equal(0);
		// });
		
		
	});

});