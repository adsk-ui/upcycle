describe('base', function(){
	var base;
	beforeEach(function(){
		base = $('<div></div>').base().data('upcycle-base');
	});
	describe('#_getLabel', function(){
		var label;
		it('returns localized label when localizeLabels option is TRUE', function(){
			base._setOptions({
				'localizeLabels': true
			}); 
			label = base._getLabel('MORELESS_MORE');
			expect(label).to.equal('More');
		});
		it('returns NON-localized label when localizeLabels option is FALSE', function(){
			base._setOptions({
				'localizeLabels': false
			});
			label = base._getLabel('MORELESS_MORE');
			expect(label).to.equal('MORELESS_MORE');
		});
	});
});