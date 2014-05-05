describe('selectlist', function(){
	var data = {
		'facets': [{
			'name': 'date',
			'displayName': 'Date',
			'options':['Today','Yesterday']
		},{
			'name': 'severity',
			'displayName': 'Severity',
			'options':['Really high','High','Not so high','Medium','Medium low','Low']
		},{
			'name': 'type',
			'displayName': 'Type',
			'options':['Hotfix','Coldfix','Warmfix']
		}]
	};
	var selectlist = $('<div/>').selectlist().data('upcycle-selectlist');
	it('triggers selection:changed events', function(done){
		selectlist.reset();
		selectlist.add(data.facets);
		selectlist.element.one('selectlist:selection:changed', function(event, data){
			expect(data.facets).to.have.length(1);
			expect(data.facets[0].name).to.equal('date');
			expect(data.facets[0].options).to.have.length(1);
			expect(data.facets[0].options[0]).to.equal('Today');
			done();
		});
		var $checkboxes = selectlist.element.find('[type="checkbox"]');
		$checkboxes[0].checked = true;
		$checkboxes.eq(0).trigger('change');
	});
	describe('#checkboxToggle', function(){
		it('checks boxes in markup', function(done){
			selectlist.reset();
			selectlist.add(data.facets);
			selectlist.element.one('selectlist:selection:changed', function(event, data){
				var $checkboxes = selectlist.element.find('[type="checkbox"]:checked');
				expect($checkboxes).to.have.length(4);
				expect($checkboxes[0].getAttribute('data-facet')).to.equal('date');

				expect(data.facets).to.have.length(3);

				done();
			});
			selectlist.checkboxToggle([{
				'name': 'date',
				'options': ['Yesterday']
			},{
				'name': 'severity',
				'options': ['Not so high', 'Low']
			},{
				'name': 'type',
				'options': ['Hotfix']
			}], true);
			
		});
	});
	describe("#checkboxToggleAll", function(){
		it('selects all checkboxes', function(done){
			selectlist.reset(data.facets);
			selectlist.element.one('selectlist:selection:changed', function(event, data){
				selectlist.element.find('[type="checkbox"]').each(function(i, checkbox){
					expect(checkbox.checked).to.equal(true);
				});
				done();
			});
			selectlist.checkboxToggleAll(true);
		});
	});
});