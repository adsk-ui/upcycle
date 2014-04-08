describe('moreless', function(){
	it('has no conflict', function(){
		chai.expect($.fn.moreless.noConflict).to.be.a('function');
	});
});