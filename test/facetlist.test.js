describe('facetlist', function(){
	var	facetlist = $('<div/>').facetlist().data('upcycle-facetlist');

	describe('#add', function(){
		facetlist.reset();
		it('adds facets to list', function(){
			facetlist.add({
				'name': 'name',
				'displayName': 'Name',
				'options': ['Jimmy']
			});
			expect(facetlist.option('facets')).to.have.length(1);
		});
		it('does not create duplicates', function(){
			facetlist.add({
				'name': 'name',
				'displayName': 'Name',
				'options': ['Jojo']
			});
			expect(facetlist.option('facets')).to.have.length(1);
			expect(facetlist.option('facets')[0].options).to.have.length(2);
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
	});
	describe('#reset', function(){
		it('removes all facets from list', function(){
			facetlist.add({
				'name': 'name',
				'displayName': 'Name',
				'options': ['Jimmy']
			});
			expect(facetlist.option('facets')).to.have.length(1);

			facetlist.reset();
			expect(facetlist.option('facets')).to.have.length(0);		
		});
	});
});