describe('filter', function(){
	var filterOptions = {
      'data': [{
        'name': 'Mike',
        'age': 10,
        'greeting': 'Hello'
      },{
        'name': 'Aaron',
        'age': 12,
        'greeting': 'Hi'
      },{
        'name': 'Eddie',
        'age': 14,
        'greeting': 'Hey'
      },{
      	'name': 'Mike',
      	'age': 20,
      	'greeting': 'Yo'
      }],
      'facets': [{
        'name': 'name',
        'displayName': 'Name'
      },{
      	'name': 'age',
      	'displayName': 'Age'
      }]
    };
    var filter = $('<div/>').filter(filterOptions).data('upcycle-filter');
	it('adds facet options based on dataset', function(){
		var facets = filter.option('facets');
		expect(facets).to.be.a('array');
		expect(facets).to.have.length(2);
		expect(facets[0].options).to.be.a('array');
		expect(facets[0].options).to.have.length(3);
		expect(facets[1].options).to.be.a('array');
		expect(facets[1].options).to.have.length(4);
	});
});