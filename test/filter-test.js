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
  it('does not attempt to determine facet options if data source not provided', function(){
    filter.option({
      'data': null
    });
    var facets = filter.option('facets');
    expect(facets).to.be.a('array');
    expect(facets).to.have.length(2);
    expect(facets[0].options).to.have.length(0);
  });
  it('includes selected facets with change events', function(done){
    filter.element.one('filterchange', function(event, data){
      expect(data.selectedFacets.name).to.have.length(1);
      done();
    });
    var $checkboxes = filter.element.find('[type="checkbox"]');
    $checkboxes[0].checked = true;
    $checkboxes.eq(0).trigger('change');
  });
  it('includes filtered dataset with change events', function(done){
    filter.option('data', filterOptions.data);
    filter.element.one('filterchange', function(event, data){
      expect(data.filteredData).not.to.be.undefined;
      expect(data.filteredData).to.have.length(3);
      done();
    });
    var $checkboxes = filter.element.find('[type="checkbox"]');
    $checkboxes[0].checked = true;
    $checkboxes[1].checked = true;
    $checkboxes.eq(0).trigger('change');
  });
});