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
      'facets': [{
        'name': 'name',
        'displayName': 'Name'
      },{
        'name': 'age',
        'displayName': 'Age'
      }]
    });
    var facets = filterpanel.option('facets');
    expect(facets).to.be.a('array');
    expect(facets).to.have.length(2);
    expect(facets[0].options).to.be.undefined;
  });
  it('supports "mapData" method on facets to map/create facet options from data', function(){

    filterpanel.option({
      data: filterOptions.data,
      facets: [{
        name: 'name',
        displayName: 'Name'
      },{
        name: 'age',
        displayName: 'Age',
        mapData: function(age){
          return age * 2;
        }
      }]
    });

    var facets = filterpanel.option('facets');
    expect(facets[0].options[0]).to.equal('Mike');
    expect(facets[1].options[0]).to.equal(20);
    expect(facets[1].options[1]).to.equal(24);
    expect(facets[1].options[2]).to.equal(28);
    expect(facets[1].options[3]).to.equal(40);
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
      expect(data.data[2].name).to.equal('Mike');
      done();
    });
    var $checkboxes = filterpanel.element.find('[type="checkbox"]');
    $checkboxes[0].checked = true;
    $checkboxes[1].checked = true;
    $checkboxes.eq(0).trigger('change');
  });
  it('supports "validateMatch" method for customized logic to to test that items in the dataset match the selected facet options', function(done){
    filterpanel.option({
      data: filterOptions.data,
      facets: [{
        name: 'age',
        displayName: 'Age',
        validateMatch: function(selectedOption, age){
          return selectedOption <= age;
        }
      }]
    });
    filterpanel.element.one('filterpanel:selection:changed', function(event, data){
      // Expect anyone age 12 or older to be selected
      expect(data.data).to.have.length(3);
      expect(data.data[0].name).to.equal('Aaron');
      expect(data.data[1].name).to.equal('Eddie');
      done();
    });
    var $age12Checkbox = filterpanel.element.find('[type="checkbox"][data-facet-option="12"]');
    // check the box for age "12"
    $age12Checkbox.get(0).checked = true;
    $age12Checkbox.eq(0).trigger('change');
  });

});