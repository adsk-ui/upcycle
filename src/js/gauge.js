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
	$.widget("upcycle.gauge", {
		options : {
			className : 'upcycle-gauge',
			progressCurrent : 0,
			progressAvail: 100,
			width: '100%',	
			title: 'Gauge',
			unitText: 'units',
			availText: 'available',
			textDisplayed: true
		},

		_create : function(){
			this.createGauge();
			return this;
		},

		createGauge : function(){
			var gauge = "<div class=" + this.options.className + "><div class='containerBar'><div class='progressBar'></div></div></div>";
			var total = this.options.progressCurrent + this.options.progressAvail;
			var progress = Math.round((this.options.progressCurrent / total) * 100) + '%';
			this.element.append(gauge);
			this.element.find(".containerBar").css("width", this.options.width);
			this.element.find(".progressBar").width(progress);
			if (this.options.textDisplayed === true) {
				this.element.find("." + this.options.className).prepend("<span class='title'>" + this.options.title + "</span>");
				this.element.find(".containerBar").append("<span class='unitText'><b>" + this.options.progressCurrent + "</b> " + this.options.unitText + "</span>");
				this.element.find(".containerBar").append("<span class='unitsAvail'><b>" + this.options.progressAvail + "</b> "  + this.options.availText + "</span>");
			}
		}
	});
});