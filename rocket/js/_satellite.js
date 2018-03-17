// Satallite
!function ($) {

	"use strict";

	var SATELLITE_VERSION = '1.0.1';

	var Satellite = {
		version: SATELLITE_VERSION,
		gaon: ($('#google-analytics').length > 0),
		transitionend: function($elem){
			var transitions = {
				'transition': 'transitionend',
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'otransitionend'
			};
			var elem = document.createElement('div'),
				end;
		
			for (var t in transitions){
				if (typeof elem.style[t] !== 'undefined'){
					end = transitions[t];
				}
			}
			if(end){
				return end;
			}else{
				end = setTimeout(function(){
					$elem.triggerHandler('transitionend', [$elem]);
				}, 1);
				return 'transitionend';
			}
		}
	};

	var satellite = function(method){
		var type = typeof method,
			meta = $('meta.satellite-mq');

	    if (!meta.length) {
	      $('<meta class="satellite-mq">').appendTo(document.head);
	    }

	    if(type === 'undefined'){
			Satellite.MediaQuery._init();
		}

		return this;
	};

	window.Satellite = Satellite;
	$.fn.satellite = satellite;
	
	// Polyfill for requestAnimationFrame
	(function() {
		if (!Date.now || !window.Date.now)
			window.Date.now = Date.now = function() { return new Date().getTime(); };
	
			var vendors = ['webkit', 'moz'];
			for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
				var vp = vendors[i];
					window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
					window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame'] || window[vp+'CancelRequestAnimationFrame']);
			}
			if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || window.cancelAnimationFrame) {
				var lastTime = 0;
					window.requestAnimationFrame = function(callback) {
						var now = Date.now();
						var nextTime = Math.max(lastTime + 16, now);
						return setTimeout(function() { callback(lastTime = nextTime); },
							nextTime - now);
					};
				window.cancelAnimationFrame = clearTimeout;
			}
			/**
			* Polyfill for performance.now, required by rAF
			*/
			if(!window.performance || !window.performance.now){
				window.performance = {
					start: Date.now(),
					now: function(){ return Date.now() - this.start; }
				};
			}
	})();

}(jQuery);