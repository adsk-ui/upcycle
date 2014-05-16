describe('filterpanel', function(){
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
  var filterpanel = $('<div/>').filterpanel(filterOptions).data('upcycle-filterpanel');
	
  it('adds facet options based on dataset', function(){
		var facets = filterpanel.option('facets');
		expect(facets).to.be.a('array');
		expect(facets).to.have.length(2);
		expect(facets[0].options).to.be.a('array');
		expect(facets[0].options).to.have.length(3);
		expect(facets[1].options).to.be.a('array');
		expect(facets[1].options).to.have.length(4);
	});
  it('does not attempt to determine facet options if data source not provided', function(){
    filterpanel.reset();
    filterpanel.option({
      'data': null,
      'facets': filterOptions.facets
    });
    var facets = filterpanel.option('facets');
    expect(facets).to.be.a('array');
    expect(facets).to.have.length(2);
    expect(facets[0].options).to.have.length(0);
  });
  it('renders selectlist internally', function(){
    filterpanel.reset();
    filterpanel.option(filterOptions);
    var $checkboxes = filterpanel.element.find('[type="checkbox"]');
    expect($checkboxes).to.have.length(7);
  });
  it('includes filtered dataset with change events', function(done){
    filterpanel.option(filterOptions);
    filterpanel.element.one('filterpanel:selection:changed', function(event, data){
      expect(data.data).not.to.be.undefined;
      expect(data.data).to.have.length(3);
      expect(data.data[0].name).to.equal('Mike');
      expect(data.data[1].name).to.equal('Aaron');
      done();
    });
    var $checkboxes = filterpanel.element.find('[type="checkbox"]');
    $checkboxes[0].checked = true;
    $checkboxes[1].checked = true;
    $checkboxes.eq(0).trigger('change');
  });

  xit('provides dataExtraction option', function(done){
    filterpanel.clear();
    filterpanel.option({
      'dataExtraction': function(obj, key){
        return obj.attributes[key];
      },
      'data': [{
        'attributes': {
          'name': 'Mike'
        }
      },{
        'attributes': {
          'name': 'Aaron'
        }
      }]
    }).element.one('filterpanelchange', function(event, data){
      expect(data.selectedFacets[0].options).to.have.length(1);
      expect(data.filteredData).to.be.length(1);
      done();
    });
    filterpanel.set({
      'name': 'name',
      'options':['Mike']
    });
  });
});