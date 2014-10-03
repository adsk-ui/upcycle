describe('Gauge widget', function(){
	describe('with default options', function(){
		beforeEach(function(){
			$gauge = $('<div></div>').gauge();
		});
		it('creates a container attached to a parent element', function(){
			expect($gauge.children().hasClass("upcycle-gauge")).to.be.true;
			expect($gauge.is("div")).to.be.true;
		});

		it('creates a progress element inside the container element', function(){
			expect($gauge.find(".progress")).to.exist;
		});

		it('has default options that are used when no parameters are passed in', function(){
			var options = {
				className : 'upcycle-gauge',
				progressCurrent : 0,
				progressAvail: 100,
				width: '100%',
				title: 'Gauge',
				unitText: 'units',
				availText: 'available',
				textDisplayed: true
				};
			var total = options.progressCurrent + options.progressAvail;
			var progress = Math.round((options.progressCurrent / total) * 100);
			expect($gauge.children().hasClass(options.className)).to.be.true;
			expect($gauge.find(".containerBar").css("width")).to.equal(options.width);
			expect($gauge.find(".progressBar").width()).to.equal(progress);
			expect($gauge.find(".title").text()).to.equal(options.title);
			expect($gauge.find(".unitText").text()).to.equal(options.progressCurrent + " " + options.unitText);
			expect($gauge.find(".unitsAvail").text()).to.equal(options.progressAvail + " " + options.availText);			
		});
	});
	describe('with passed options', function(){
		var options = {
				className : 'new-gauge',
				progressCurrent : 40,
				progressAvail: 100,
				width: '100%',
				title: 'Fun',
				unitText: 'pennies',
				availText: 'dollars',
				textDisplayed: true
		};
		var options_noTxt = {
				className : 'upcycle-gauge',
				progressCurrent : 30,
				progressAvail: 100,
				width: '100%',
				title: 'Gauge',
				unitText: 'units',
				availText: 'available',
				textDisplayed: false
		};
		it('uses passed options instead of the defaults when available', function(){
			var $gauge = $('<div></div>').gauge(options);
			var total = options.progressCurrent + options.progressAvail;
			var progress = Math.round((options.progressCurrent / total) * 100);
			expect($gauge.children().hasClass(options.className)).to.be.true;
			expect($gauge.find(".containerBar").css("width")).to.equal(options.width);
			expect($gauge.find(".progressBar").width()).to.equal(progress);
			expect($gauge.find(".title").text()).to.equal(options.title);
			expect($gauge.find(".unitText").text()).to.equal(options.progressCurrent + " " + options.unitText);
			expect($gauge.find(".unitsAvail").text()).to.equal(options.progressAvail + " " + options.availText);
		});
		it('does not display text when textDisplayed is set to false', function(){
			var $gauge = $('<div></div>').gauge(options_noTxt);
			expect($gauge.find(".title").text()).to.equal('');
			expect($gauge.find(".unitText").text()).to.equal('');
			expect($gauge.find(".unitsAvail").text()).to.equal('');
		});

	});
});