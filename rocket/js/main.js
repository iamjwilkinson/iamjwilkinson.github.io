var DCOM = {
	inview: function(){
		$('[data-inview]').each(
			function(){
				var me = $(this),
					inview = new Waypoint.Inview({
						element: me[0],
						entered: function(){
							$(this.element).addClass('in-view');
							$(document).trigger('in-view');
						},
						exited: function(){
							$(this.element).removeClass('in-view');
							$(document).trigger('not-in-view');
						}
					});
			}
		);
	},
	down: true,
	didScroll: null,
	lastScrollTop: 0,
	delta: 2,
	deltaShrink: 0,
	st: null,
	hasScrolled: function(){
		DCOM.down = true,
		DCOM.didScroll = null,
		DCOM.delta = 2,
		DCOM.deltaShrink = 0,
		DCOM.st = $(window).scrollTop();

		if(DCOM.st < 0) {
			DCOM.st = 0;
		}
		
		if(DCOM.st > 0) {
			$('html').addClass('scroll-not-at-top');
		} else {
			$('html').removeClass('scroll-not-at-top');
		}

		if(Math.abs(DCOM.lastScrollTop - DCOM.st) <= DCOM.delta) {
			return;
		}
		
		if (DCOM.st > DCOM.lastScrollTop){
			// Scroll Down
			$('html')
				.addClass('is-scrolling')
				.removeClass("is-scrolling-up");
			
			if(DCOM.down == true) {
				$('html')
					.addClass("is-scrolling-down");
					$('body').trigger('scroll.is-scrolling', 'down');
					$('body').trigger('scroll.is-scrolling-down', 'down');
		
				setTimeout(function() {
					$('html')
						.removeClass("is-scrolling");
					$('body').trigger('scroll.is-not-scrolling');
				},800);
		
				DCOM.down = false;
		
			}
		
		} else {
			// Scroll Up		
			DCOM.down = true;
			$('html')
				.addClass('is-scrolling is-scrolling-up')
				.removeClass("is-scrolling-down");
				$('body').trigger('scroll.is-scrolling', 'up');
				$('body').trigger('scroll.is-scrolling-up');
				setTimeout(function() {
					$('html')
						.removeClass("is-scrolling");
						$('body').trigger('scroll.is-not-scrolling');
				},800);
			
			if(DCOM.st + $(window).height() < $(document).height()) {
				$('html')
					.removeClass('is-scrolling-down')
					.addClass("is-scrolling-up");
					
				setTimeout(function() {
					$('html')
						.removeClass("is-scrolling");
					$('body').trigger('scroll.is-not-scrolling');
				},800);
		
			}
		}
		
		if(DCOM.st + $(window).outerHeight() > $('body').outerHeight()-200) {
			$('html').addClass("is-scrolled-near-bottom");
		} else {
			$('html').removeClass("is-scrolled-near-bottom");
		}
		
		DCOM.lastScrollTop = DCOM.st;
		
	},
	checkScroll: function(){

		$(window).scroll(function(event){
			DCOM.didScroll = true;
		});
		
		setInterval(function() {
			if (DCOM.didScroll) {
				DCOM.hasScrolled();
				DCOM.didScroll = false;
			}
		}, 150);
		
		$(window).trigger("scroll");	
	},
	offCanvas: function(){
		$('[id*=side-toggle], [id*=nav-toggle]').on(
			'change',
			function(){
				if($(this).is(':checked')){
					$('body').addClass('nav-active');
					$(document).trigger('nav-is-active');
				}else{
					$('body').removeClass('nav-active');
					$(document).trigger('nav-is-not-active');
				}
			}
		);
	},
	mediaGalleries: function(){
		if($('.swiper-container:not(.has-applied-swiper)').length < 1){
			return;
		}
		var mediaGallery = new Swiper('.swiper-container:not(.has-applied-swiper)', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			resistance: false,
			resistanceRatio: 0,
			grabCursor: true,
			hashnav: true,
			speed: 600
		});

		$(".swiper-container:not(.has-applied-swiper)").each(function(index, element){
		    var swiper = this.swiper;
		    swiper.update();
		    $(this).addClass('has-applied-swiper');
		});
		
		function updateFullScreenToggle(thisGallery){
			thisGallery.on(
				'sliderMove',
				function(){
					$('html').addClass('swiper-is-changing');
				}
			).on(
				'slideChangeStart',
				function(){
					$('html').addClass('swiper-is-changing');
				}
			).on(
				'touchEnd',
				function(){
					$('html').removeClass('swiper-is-changing');
				}
			).on(
				'slideChangeEnd',
				function(){
					$('html').removeClass('swiper-is-changing');
				}
			);			
		}

		updateFullScreenToggle(mediaGallery);
	},
	follow: null,
	followThis: null,
	followAlong: function(){
		DCOM.follow = $('[data-follow]');
		if(DCOM.follow.length > 0){
			DCOM.follow.each(
				function(){
					DCOM.followThis = $(this);
					var thisOffset = DCOM.followThis.parent().offset(),
						topOffset = 40,
						thisWidth = DCOM.followThis.parent().outerWidth(),
						thisHeight = DCOM.followThis.outerHeight(),
						followHeight = $(document).find(DCOM.follow.data('follow')).outerHeight(),
						shouldFollow = false;
					
					function updateFollowAlong(){
						windowTop = $(window).scrollTop(),
						notOffset = $('.main-content article > .flexible:not(.is-offset), .main-content > .flexible:not(.is-offset)').first();
						if(notOffset.length > 0){
							breakUp = notOffset.offset().top - thisHeight;
						}else{
							breakUp = ($('.main-content article').offset().top + $('.main-content article').outerHeight()) - thisHeight;
						}

						if(
							followHeight > thisHeight
						){
							shouldFollow = true;
						}

						if(
							(windowTop > DCOM.followThis.parent().offset().top || (thisOffset.top - topOffset) < windowTop) &&
							shouldFollow == true &&
							Satellite.MediaQuery.atLeast('large')
						){
							DCOM.followThis.css(
								{
									position: 'fixed',
									top: topOffset,
									width: thisWidth
								}
							);
							if(window.scrollX == 0){
								DCOM.followThis.css(
									{
										left: thisOffset.left,
									}
								);
							}
						}else{
							DCOM.followThis.attr('style','');
						}

						// Break it up
						if(
							(breakUp - (topOffset * 2)) < windowTop &&
							shouldFollow == true &&
							Satellite.MediaQuery.atLeast('large')
						){
							DCOM.followThis.css(
								{
									top: (breakUp - windowTop) - topOffset
								}
							)
						}
					}
					
					$(window).on(
						'resize scroll',
						function(){
							thisOffset = DCOM.followThis.offset(),
							topOffset = 40,
							thisWidth = DCOM.followThis.parent().outerWidth(),
							thisHeight = DCOM.followThis.outerHeight();

							followHeight = $(document).find(DCOM.follow.data('follow')).outerHeight();


							
							updateFollowAlong();

						}
					);
					
				}
			)
		}
	},
	dataMap: null,
	map: null,
	center: null,
	mapStyles: [
	    {
	        "featureType": "water",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "color": "#e9e9e9"
	            },
	            {
	                "lightness": 17
	            }
	        ]
	    },
	    {
	        "featureType": "landscape",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "color": "#f5f5f5"
	            },
	            {
	                "lightness": 20
	            }
	        ]
	    },
	    {
	        "featureType": "road.highway",
	        "elementType": "geometry.fill",
	        "stylers": [
	            {
	                "color": "#ffffff"
	            },
	            {
	                "lightness": 17
	            }
	        ]
	    },
	    {
	        "featureType": "road.highway",
	        "elementType": "geometry.stroke",
	        "stylers": [
	            {
	                "color": "#ffffff"
	            },
	            {
	                "lightness": 29
	            },
	            {
	                "weight": 0.2
	            }
	        ]
	    },
	    {
	        "featureType": "road.arterial",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "color": "#ffffff"
	            },
	            {
	                "lightness": 18
	            }
	        ]
	    },
	    {
	        "featureType": "road.local",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "color": "#ffffff"
	            },
	            {
	                "lightness": 16
	            }
	        ]
	    },
	    {
	        "featureType": "poi",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "color": "#f5f5f5"
	            },
	            {
	                "lightness": 21
	            }
	        ]
	    },
	    {
	        "featureType": "poi.park",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "color": "#dedede"
	            },
	            {
	                "lightness": 21
	            }
	        ]
	    },
	    {
	        "elementType": "labels.text.stroke",
	        "stylers": [
	            {
	                "visibility": "on"
	            },
	            {
	                "color": "#ffffff"
	            },
	            {
	                "lightness": 16
	            }
	        ]
	    },
	    {
	        "elementType": "labels.text.fill",
	        "stylers": [
	            {
	                "saturation": 36
	            },
	            {
	                "color": "#333333"
	            },
	            {
	                "lightness": 40
	            }
	        ]
	    },
	    {
	        "elementType": "labels.icon",
	        "stylers": [
	            {
	                "visibility": "off"
	            }
	        ]
	    },
	    {
	        "featureType": "transit",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "color": "#f2f2f2"
	            },
	            {
	                "lightness": 19
	            }
	        ]
	    },
	    {
	        "featureType": "administrative",
	        "elementType": "geometry.fill",
	        "stylers": [
	            {
	                "color": "#fefefe"
	            },
	            {
	                "lightness": 20
	            }
	        ]
	    },
	    {
	        "featureType": "administrative",
	        "elementType": "geometry.stroke",
	        "stylers": [
	            {
	                "color": "#fefefe"
	            },
	            {
	                "lightness": 17
	            },
	            {
	                "weight": 1.2
	            }
	        ]
	    }
	],
	mapIt: function(){
		// Map
		DCOM.dataMap = $('[data-map]').get(0);
		DCOM.center = new google.maps.LatLng(33.169169, -86.813965);
		DCOM.mapOptions = {
			zoom: 6,
			center: DCOM.center,
			mapTypeID: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			scrollwheel: false,
			styles: DCOM.mapStyles
		};
		DCOM.map = new google.maps.Map(DCOM.dataMap, DCOM.mapOptions);	
	},
	mapItLocation: function(){
		// Map
		DCOM.dataMap = $('[data-location-map]').get(0);
		DCOM.center = new google.maps.LatLng($('[data-location-map]').data('latitude'), $('[data-location-map]').data('longitude'));
		DCOM.mapOptions = {
			zoom: 17,
			center: DCOM.center,
			mapTypeID: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: ($('[data-location-map]').data('location-map'))?true:false,
			draggable:  ($('[data-location-map]').data('location-map'))?false:true,
			scrollwheel: false,
			animation: google.maps.Animation.DROP
// 			styles: DCOM.mapStyles
		};
		DCOM.map = new google.maps.Map(DCOM.dataMap, DCOM.mapOptions);
		
		DCOM.marker = new google.maps.Marker({
		    position: DCOM.center
		});
		
		DCOM.marker.setMap(DCOM.map);

	},
	initMap: function(){
		if($('[data-map]').length > 0){
			DCOM.mapIt();
			google.maps.event.addDomListener(window, 'resize', function(){
				DCOM.map.panTo(DCOM.center);
			});
		}
		if($('[data-location-map]').length > 0){
			DCOM.mapItLocation();
			google.maps.event.addDomListener(window, 'resize', function(){
				DCOM.map.panTo(DCOM.center);
			});
		}
	},
	discoverAlabama: function(){
		DCOM.destinations = $('[data-destinations]'),
		data = DCOM.destinations.data('destinations');
		
		// Map
		DCOM.initMap();
		
		// Toggle the number changes.
		// This could probably be condensed...
		$(document).on(
			'click',
			'[data-destinations] .from-here li',
			function(){
				loc = $(this),
				destination = loc.data('value');
				$.each(data.to, function(k, options) {
					if(options.destination == $('[data-destinations] .to-here label span').text()){
						// set mapCenter on our destination
						DCOM.center = new google.maps.LatLng(parseInt(options.lat), parseInt(options.lng));
						$.each(options.distances, function(k, dist){
							if(destination == dist.ID){
								prevText = $('[data-miles]').text(),
								newText = dist.distance.replace(',', '');
								commas = $.animateNumber.numberStepFactories.separator(',')

								loc.parents('label').children('span').text(loc.text());

								// center map on new location
								DCOM.map.panTo(DCOM.center);
								DCOM.map.setZoom(7);
								
								// Count out the distance
								$('[data-miles]')
									.prop('number', prevText)
									.stop()
									.animateNumber(
									{
										number: newText,
										numberStep: commas
									},
									2000
								);
							}
						});
					}
				});
			}
		);
		$(document).on(
			'click',
			'[data-destinations] .to-here li',
			function(){
				loc = $(this),
				destination = loc.data('value');
				$.each(data.from, function(k, options) {
					if(options.location == $('[data-destinations] .from-here label span').text()){
						$.each(data.to, function(k, toData) {
							if(toData.destination == loc.text()){
								$.each(toData.distances, function(k, distanceData){
									if(distanceData.ID === options.ID){
										console.log(distanceData);
										DCOM.center = new google.maps.LatLng(parseInt(toData.lat), parseInt(toData.lng));
										prevText = $('[data-miles]').text(),
										newText = distanceData.distance.replace(',', '');
										commas = $.animateNumber.numberStepFactories.separator(',')
			
										// center map on new location
										DCOM.map.panTo(DCOM.center);
										DCOM.map.setZoom(7);
										
										loc.parents('label').children('span').text(loc.text());
										
										// Count out the distance
										$('[data-miles]')
											.prop('number', prevText)
											.stop()
											.animateNumber(
											{
												number: newText,
												numberStep: commas
											},
											2000
										);
									}
								});
							}
						});
					}
				});
			}
		);		
	},
	dropdown: null,
	dropdowns: function(){
		DCOM.dropdown = $('.button-dropdown');
		$(document).on(
			'click',
			function(){
				if (!$(event.target).parents('.button-dropdown').is(".button-dropdown")) {
					$(document).find('.button-dropdown').parent().removeClass('is-open');
				}
			}
		)
		DCOM.dropdown.on(
			'click',
			function(e){
				DCOM.thisDropdown = $(this);
				DCOM.thisDropdown.parent().toggleClass('is-open');
				e.preventDefault();
			}
		);
	},
	articlesinView: function(){
		$('.article.next').each(
			function(){
				var me = $(this),
					inview = new Waypoint.Inview({
						element: me[0],
						enter: function(direction){
							article = $(this.element).data('article');
							if(direction == 'down'){
								DCOM.articlesAjax(article);
								this.destroy();
							}
						}
					});
			}
		);
		$('.article.current').each(
			function(){
				var me = $(this),
					inview = new Waypoint.Inview({
						element: me[0],
						exit: function(direction){
							article = $(this.element);
							if(direction == 'up'){
								articleURL = article.data('article');
								if(history.pushState) {
									history.pushState('', '', articleURL);
								}
							}
						}
					});
			}
		);
	},
	articlesAjax: function(article){
		articleData = false;
		$.ajax(
			{
				url: article,
				type: 'GET',
				dataType: 'html',
				beforeSend: function(){
					$(document).trigger('articles.ajax.before');
				},
				success: function(data){
					articleData = data;
					$(document).trigger('articles.ajax.success');
					$('.article.current').removeClass('current').addClass('previous');
					$('.article.next').html($(articleData).find('.article.current').html());
				},
				complete: function(data){
					$(document).trigger('articles.ajax.complete');
					$('.article.next').removeClass('next').addClass('current');
					$(articleData).find('.article.next').insertBefore($('.article.current').parent().find('.flexible.call-to-action'));
					DCOM.mediaGalleries();
					DCOM.articlesinView();
					DCOM.videoPlayer();
					DCOM.checkScroll();
					articleURL = $('.article.current').data('article');
					if(history.pushState) {
						history.pushState('', '', articleURL);
					}
					if(DCOM.addthis_id.length){
					    addthis.init();
					    addthis.toolbox('.addthis_toolbox');
					}
				},
				error: function(){
					$(document).trigger('articles.ajax.error');
				}
			}
		)
	},
	dataTrack: function(){
		trackContainer = $('[data-track]'),
		trackThis = $('[data-track]').data('track');
		if(trackContainer.length > 0 && $(trackThis).length > 0){
			$(trackThis).each(
				function(){
					var me = $(this);
					inview = new Waypoint({
						element: me[0],
						handler: function(){
							$(document).find(trackThis).removeClass('is-active-section');
							$(trackContainer).find('.is-active-link').removeClass('is-active-link');
							$(document).trigger('track-is-inactive');
							var activeID = $(this.element).attr('id');
							$(this.element).addClass('is-active-section');
							$(document).trigger('track-is-active');
							$(trackContainer).find('#menu-item-' + activeID).addClass('is-active-link');
						},
						offset: "15%"
					});					
				}
			);
			$('[data-track] a[href*="#"]:not([href="#"])').click(function() {
				$('.is-active-link').removeClass('is-active-link');
				$(this).parent('li').addClass('is-active-link');
			    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			    	var target = $(this.hash);
					target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
					if (target.length) {
			        	$('html, body').animate({
							scrollTop: target.offset().top
						}, 1000);
						return false;
			      	}
			    }
			});
		}
	},
	videoPlayer: function() {
		function isScrolledIntoView(elem) {
			var docViewTop = $(window).scrollTop();
			var docViewBottom = docViewTop + $(window).height();
			var elemTop = $(elem).offset().top;
			var elemBottom = elemTop + $(elem).height();
		
			return ((elemBottom <= docViewBottom) && (elemBottom >= docViewTop));
		}
		
		function play(t, startover) {
			if(startover === true) {
				t.currentTime = 0;
				t.loop = false;
				$(t).data('interacted', true);
				$(t).parent().addClass('interacted').removeClass('autoplay');
			}
			
			t.muted = false;
			t.play();
			if(can_autoplay && is_ios) {
				try {
					t.webkitEnterFullscreen();
					$(t).one(
						'webkitendfullscreen',
						function() {
							pause(t);
						}
					);
				} catch(err) {}
			}
			$(t).parent().addClass('playing').removeClass('not-playing').removeClass('ended');
			$('body').addClass('is-scrolling-down');
		}
		
		function pause(t) {
			t.pause();
			$(t).parent().addClass('not-playing').removeClass('playing').removeClass('autoplay');
			$('body').removeClass('is-scrolling-down');
		}
		
		function autoplay(t) {
			t.muted = true;
			t.loop = true;
			t.play();
			$(t).parent().addClass('autoplay').removeClass('not-playing');
		}
		
		function watchAutoPlay(e, direction){
			var scrollBottomPosition = $(window).scrollTop() + $(window).outerHeight() - ($(window).outerHeight() * .1),
				video = $('.media-video video'),
				hasFoundCurrentVideo = false,
				thisVideo;
			
			video.each(
				function() {
					var thisVideo = $(this),
						top = thisVideo.position().top;
					
					if(isScrolledIntoView(this)) {
						if(!thisVideo.data('interacted')) {
							autoplay(this);
						}
					} else {
						pause(this);
					}
				}
			);
		}
		
		var lastMouse = {x: 0, y:0},
			is_ios = /(iPhone|iPod|iPad)/i.test(navigator.userAgent),
			is_old_ios = is_ios && navigator.userAgent.match(/OS [6789]_/i),
			can_autoplay = (!is_ios) || (!is_old_ios);
		
		if(can_autoplay) { 
			$('.media-video video').each(
				function() {
					$(this).removeAttr('controls').attr('muted', 'muted')
						.attr('webkit-playsinline', 'webkit-playsinline')
						.attr('playsinline', 'playsinline');
				}
			);
		} else {
			$('.media-video video').each(
				function() {
					$(this).removeAttr('controls').removeAttr('webkit-playsinline').removeAttr('playsinline').removeAttr('autoplay').removeAttr('loop').removeAttr('muted').parent().addClass('not-playing');
				}
			);			
		}
		
		if(can_autoplay) {
		
			$('body').on(
				'click',
				'.media-video video',
				function(e) {
					if(!$(e.target).is('video')) {
						return;
					}
					if(e.target.muted) {
						play(e.target, true);
					} else {
						if(e.target.paused) {
							play(e.target, false);
						} else {
							pause(e.target);
						}
					}
				}
			);
			
			
			$('.media-video video').on(
				'ended',
				function(e) {
					$(e.target).parent().addClass('not-playing').addClass('ended').removeClass('playing').removeClass('autoplay');
				}
			).on(
				'mousemove',
				function(e) {
					if(!e.target.paused) {
						lastMouse = {x: e.clientX, y: e.clientY};
						
						setTimeout(
							function() {
								if(lastMouse.x == e.clientX && lastMouse.y == e.clientY) {
									$(e.target).parent().removeClass('hovering');
								}
							}, 1000
						);
						$(e.target).parent().addClass('hovering');
					}
				}
			);
		
			$('body').on(
				'scroll.is-scrolling',
				watchAutoPlay
			);
			
			watchAutoPlay();
		} else {
			$('body').on(
				'click',
				'.media-video video',
				function(e) {
					if(!$(e.target).is('video')) {
						return;
					}

					if(e.target.paused) {
						e.target.play();
					} else {
						e.target.pause();
					}
				}
			);

		}
	},
	addthis_id: null,
	init: function(){
		DCOM.addthis_id = $('body[data-addthis]');
		if(DCOM.addthis_id.length) {
			DCOM.addthis_id = DCOM.addthis_id.data('addthis');
		}
		$(document).satellite();
		DCOM.inview();
		DCOM.checkScroll();
		DCOM.offCanvas();
		DCOM.mediaGalleries();
		DCOM.followAlong();
		DCOM.discoverAlabama();
		DCOM.dropdowns();
		DCOM.articlesinView();
		DCOM.dataTrack();
		DCOM.videoPlayer();
	}
};

$(document).ready(
	function(){
		$(document).on(
			'click',
			'.media-gallery:not(.media-gallery-active) .fullscreen',
			function(e){
				var gallery = $(this).parents('.media-gallery');
				setTimeout(
					function(){
						$('html').toggleClass('media-gallery-fullscreen');
					}, 400
				);
				newClone = gallery.clone();
				newClone.appendTo('body').toggleClass('media-gallery-active');
				mediaGallery = new Swiper('.swiper-container', {
					pagination: '.swiper-pagination',
					paginationClickable: true,
					resistance: false,
					resistanceRatio: 0,
					grabCursor: true,
					hashnav: true,
					speed: 600
				});
				e.preventDefault();
			}
		).on(
			'click',
			'.media-gallery-active .fullscreen',
			function(e){
				var gallery = $(this).parents('.media-gallery');
				$('html').toggleClass('media-gallery-fullscreen');
				setTimeout(
					function(){
						$('.media-gallery-active').remove();
					}, 400
				);
				e.preventDefault();
			}
		);

		DCOM.init();
	}
)