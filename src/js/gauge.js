/**
* Gauge widget
* options:
* progressCurrent (integer): current progress of total
* progressAvail (integer): remaining progress of total
* width (css width value): how wide the bar is; default is auto but any value may be provided instead; integer will result in a pixel width, whereas string is required for percent, em, etc.
* title (string): text above the bar
* unitText (string): label for units used
* availTexxt (string): label for total available units
*/

$(function(){
	$.widget("portal.gauge", {

		options : {
			className : 'upcycle-gauge',
			progressCurrent : 0,
			progressAvail: 100,
			width: 'auto',	
			title: '',
			unitText: 'units',
			availText: 'available'
		},

		_create : function(){
			this.element.append('<div class=' + this.options.className + '><span class="title"></span><div class="containerBar"><div class="progressBar"></div></div><span class="unitsUsed"></span><span class="unitsAvail"></span></div>');
			this.createGauge();
			return this;
		},

		createGauge : function(){
			var bar = this;
			var width = this.options.width;
			var total = bar.options.progressCurrent + bar.options.progressAvail;
			var calcUnitsUsed = function() {
				return Math.round((bar.options.progressCurrent / total) * 100) + '%';
			};
			this.element.find('.title').text(this.options.title);
			this.element.find('.containerBar').css('width', width);		
			this.element.find('.progressBar').css('width', calcUnitsUsed());
			this.element.find('.unitsUsed').html("<b>" + this.options.progressCurrent + "</b> " + this.options.unitText);
			this.element.find('.unitsAvail').html("<b>" + this.options.progressAvail + "</b> " + this.options.availText);	
		}
	});
});