describe('Testing gauge widget', function(){

	it('should have a gauge based on the passed options', function(){
		var options = {
			className : 'upcycle-gauge',
			progressCurrent : 20,
			progressAvail: 100,
			width: '200',
			title: 'test gauge',
			unitText: 'units',
			availText: 'available',
			textDisplayed: true
		};
		var $element = $('<div></div>'),
			$gauge = $element.gauge(options),
			progressWidth = Math.round((options.progressCurrent / (options.progressCurrent + options.progressAvail)) * 100) + '%';
		expect($gauge.find('.containerBar').css('width')).to.equal(options.width + 'px');
		expect($gauge.find('.progressBar').css('width')).to.equal(progressWidth);
		if(options.textDisplayed === true) {
			expect($gauge.find('.title').html()).to.equal(options.title);
			expect($gauge.find('.unitsUsed').html()).to.equal("<b>" + options.progressCurrent + "</b> <span>" + options.unitText + "</span>");
			expect($gauge.find('.unitsAvail').html()).to.equal("<b>" + options.progressAvail + "</b> <span>" + options.availText + "</span>");
		} else {
			expect($gauge.find('.title').html()).to.equal('');
			expect($gauge.find('.unitsUsed').html()).to.equal('');
			expect($gauge.find('.unitsAvail').html()).to.equal('');
		}
	});

	it('should have a default gauge if no options are passed', function(){
		var $element = $('<div></div>'),
			$gauge = $element.gauge(),
			progressWidth = Math.round((0 / 100) * 100) + '%';
		expect($gauge.find('.containerBar').css('width')).to.equal('100%');
		expect($gauge.find('.progressBar').css('width')).to.equal(progressWidth);
		expect($gauge.find('.title').html()).to.equal('');
		expect($gauge.find('.unitsUsed').html()).to.equal("<b>0</b> <span>units</span>");
		expect($gauge.find('.unitsAvail').html()).to.equal("<b>100</b> <span>available</span>");
	});
});