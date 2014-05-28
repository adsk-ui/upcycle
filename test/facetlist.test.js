describe('facetlist', function(){
	var	facetlist = $('<div/>').facetlist().data('upcycle-facetlist');

	describe('#add', function(){
		facetlist.reset();
		it('adds facets to list', function(){
			facetlist.reset();
			facetlist.add({
				'name': 'name',
				'displayName': 'Name',
				'options': ['Jimmy']
			});
			expect(facetlist.option('facets')).to.have.length(1);
		});
		it('does not create duplicates', function(){
			facetlist.reset([{
				'name': 'name',
				'displayName': 'Name',
				'options': ['Jimmy']
			}]);
			facetlist.add({
				'name': 'name',
				'displayName': 'Name',
				'options': ['Jojo']
			});
			expect(facetlist.option('facets')).to.have.length(1);
			expect(facetlist.option('facets')[0].options).to.have.length(2);
		});
		it('triggers "facets:add" events', function(done){
			facetlist.element.one('facetlist:facets:add', function(event, data){
				expect(data.facets).to.have.length(1);
				expect(data.facets[0].options[0]).to.equal('James');
				done();
			});
			facetlist.add({
				'name': 'name',
				'options': ['James']
			});
		});
	});
	describe('#remove', function(){
		it('removes facets from list', function(){
			facetlist
				.reset()
				.add({
					'name': 'name',
					'displayName': 'Name',
					'options': ['Jimmy']
				});
			expect(facetlist.option('facets')).to.have.length(1);

			facetlist.remove({
				'name': 'name',
				'options': ['Jimmy']
			});
			expect(facetlist.option('facets')).to.have.length(0);		
		});
		it('triggers "facets:remove" events', function(done){
			facetlist.reset();
			facetlist.add({
				'name': 'name',
				'options': ['Jon']
			});
			facetlist.element.one('facetlist:facets:remove', function(event, data){
				expect(data.facets).to.have.length(1);
				expect(data.facets[0].options).to.have.length(1);
				expect(data.facets[0].options[0]).to.equal('Jon');
				done();
			});
			facetlist.remove({
				'name': 'name',
				'options': ['Jon']
			});
		});
	});
	describe('#reset', function(){
		it('removes all facets from list and triggers facets:remove event', function(done){
			facetlist.element.one('facetlist:facets:remove', function(event, data){
				expect(data.facets).to.have.length(1);		
				done();
			});
			facetlist.add({
				'name': 'name',
				'displayName': 'Name',
				'options': ['Jimmy']
			});
			facetlist.reset();
		});
		it('adds facets to list and triggers facets:add event', function(done){
			facetlist.reset();
			facetlist.element.one('facetlist:facets:add', function(event, data){
				expect(data.facets).to.have.length(2);
				expect(data.facets[0].name).to.equal('name');
				expect(data.facets[0].options).to.have.length(3);
				expect(data.facets[1].name).to.equal('age');
				expect(data.facets[1].options).to.have.length(2);
				done();
			});
			facetlist.reset([{
				'name': 'name',
				'options': ['James', 'Jimmy', 'Jon']
			},{
				'name': 'age',
				'options': [70, 80]
			}]);

		});
	});
	describe('#change', function(){
		it('changes facet options', function(){
			var facets;
			facetlist.reset([{
				'name': 'name',
				'options': ['James', 'Jimmy']
			}]);
			facets = facetlist.option('facets');
			
			expect(facets).to.have.length(1);
			expect(facets[0].options).to.have.length(2);
			expect(facets[0].options[0]).to.equal('James');
			
			facetlist.change({
				'name': {
					'James': 'Joe'
				}
			});

			expect(facets).to.have.length(1);
			expect(facets[0].options).to.have.length(2);
			expect(facets[0].options[0]).to.equal('Joe');
		});
	});
});