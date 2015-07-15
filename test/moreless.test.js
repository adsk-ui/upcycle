describe('moreless', function(){
	var list = '<ul id="moreless-min-items">' +
        '<li>'+
        	'One'+
        '</li>'+
        '<li class="odd">' +
          'Two'+
        '</li>'+
        '<li class="even">' +
          'Three'+
        '</li>'+
        '<li class="odd">' +
          'Four'+
        '</li>'+
    '</ul>';
    var paragraph = '<div id="moreless-min-height"><p>Kale chips hella salvia fashion axe. Food truck PBR&B Kickstarter hella. Forage shabby chic church-key pickled pour-over. Carles wolf gentrify, fingerstache kale chips small batch disrupt skateboard Helvetica Austin letterpress cray tattooed.</p></div>';

    beforeEach(function(){
    	this.$paragraph = $(paragraph).appendTo('#sandbox-inner').children('p').moreless({
        	linkContainer: '#moreless-min-height',
            truncateText: true
        }).end();
        this.$list = $(list).appendTo('#sandbox-inner').moreless({
        	minItems: 1,
            more: 'There are {0} more'
        });
    });

    afterEach(function(){
      this.$list.remove();
      this.$paragraph.remove();
    });

	it('has no conflict', function(){
		chai.expect($.fn.moreless.noConflict).to.be.a('function');
	});
	it('hides more items', function(){
		expect(this.$list.children('li:visible')).to.have.length(1);
		this.$list.remove();
		this.$list = $(list)
				.appendTo('#sandbox-inner')
				.moreless({'minItems': 'same-y'});

		expect(this.$list.children('li:visible')).to.have.length(1);
	});

    it('allows for parameterized more/less labels (swaps {0} placeholder with number of items to clip)', function(){
        expect(this.$list.find('.more').text()).to.equal('There are 3 more');
    });

    it('adds default placeholder ({0}) to beginning of label for number of items to clip if none specified', function(){
        this.$list.remove();
        this.$list = $(list)
                .appendTo('#sandbox-inner')
                .moreless({
                    minItems: 1,
                    more: 'More'
                });
        expect(this.$list.find('.more').text()).to.equal('3 More');
    });
});