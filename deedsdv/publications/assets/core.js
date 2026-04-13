(function(CORE, $, undefined) {
	CORE.win = {};
	CORE.screenSize = null;
	CORE.page;
	CORE.status = 'none';
	CORE.pageBody;

	var header;
	var headerLogo;
	var mainNav;
	var mainNavContainer;

	var searchTrigger;
	var searchPanel;
	var searchField;
	var html;

	var updateWin = function() {
		var wh = $(window).height();
		var ww = $(window).width();

		var smallScreen = 641;
		var largeScreen = 961;
		var extraLargeScreen = 1201;

		CORE.win.h = wh; // New height
		CORE.win.w = ww; // New width

		// Size-specific logic
		if(CORE.win.w >= extraLargeScreen) {
			CORE.screenSize = 'xl';
		}
		else if(CORE.win.w >= largeScreen) {
			CORE.screenSize = 'l';
		}
		else {
			CORE.screenSize = 's';
		}
	};

	// Check if main nav is not fitting ant it is time to switch to mobile
	var checkNav = function() {
		// Min gap allowed
		var navGap = 5;

		if(mainNavContainer.width() < mainNav.outerWidth() + navGap) {
			header.addClass('mobile');
		}
		else {
			header.removeClass('mobile');
		}

	};

	var checkFooter = function() {
		var socialBar = $('.social-global > .inner');
		var footer = $('footer');

		if(footer.outerHeight() + socialBar.outerHeight() > CORE.win.h) {
			footer.addClass('no-go-high');
		}
		else {
			footer.removeClass('no-go-high');
		}
	};

	CORE.init = function() {
		html = $('html');
		header = $('.page-head header');
		headerLogo = $('.page-head .logo');
		mainNav = $('.page-head nav.main > ul.menu');
		mainNavContainer = $('.page-head nav.main');
		CORE.page = $(this);
		CORE.pageBody = $('body');

		searchTrigger = $('.search-trigger');
		searchPanel = $('#big-search');
		searchField = $('#big-search #searchword');

		setupHeading();
		setupSearch();

		CORE.status = 'initialized';
		NAV.init();
		// Resize needs everything to be initialized first, hence, goes after initialization
		CORE.resize();
	};

	var setupHeading = function() {
		return;
		// TODO
		var header = $('.content-header, #content-header');
		var buttons = header.find('.btn').addClass('playful').addClass('border-slim');

		var heading = header.find('h2');
		heading.addClass('contain');
		var headingContents = heading.html();
		var span = $('<span>' + headingContents + '</span>');
		span.appendTo(header);
	};


	// ***************** search

	var setupSearch = function() {
		$(searchTrigger).on('click', function(e) {
			if (!(searchTrigger.hasClass('show'))) {
				CORE.closeAllPanels();
				openSearchPanel();
				// Disable input capturing for NoVNC
				if (typeof UI != 'undefined') {
					Util.removeEvent(document, 'click', UI.checkFocusBounds);
				}
			} else {
				CORE.closeAllPanels();
			}

			e.preventDefault();
		});

		$('#big-search .close').on('click', function(e) {
			CORE.closeAllPanels();

			// Restart input capturing for NoVNC
			if (typeof UI != 'undefined') {
				Util.addEvent(document, 'click', UI.checkFocusBounds);
			}

			e.preventDefault();
		});
	};

	var openSearchPanel = function() {
		CORE.pageBody.addClass('panel-open');
		html.addClass('panel-open');
		searchTrigger.addClass('show');
		searchPanel.addClass('open');
		focus();
	};

	var focus = function() {
		searchField.focus();
	};

	var closeSearchPanel = function() {
		searchTrigger.removeClass('show');
		searchPanel.removeClass('open');
	};

	// ***************** end search


	CORE.resize = function(auto) {
		if(auto === undefined) {
			auto = false;
		}
		updateWin();
		checkNav();
	};

	CORE.setupPage = function() {
		CORE.init();

		$(window).resize(function() {
			CORE.resize();
		});

		$(document).keyup(function(e) {
			if(e.keyCode == 27) {
				// ???
			}
		});

		$(window).on("orientationchange", function(e) {
			// ???
		});
	};

	CORE.closeAllPanels = function() {
		NAV.hideMobileNav();
		closeSearchPanel();
		CORE.pageBody.removeClass('panel-open');
		// find all template panels and remove tho 'open' class
		$('.template-panel').removeClass('open');
	};

}( window.CORE = window.CORE || {}, jQuery ));

(function(NAV, $, undefined) {

	// Main Navigation Menu
	var mobileNavSwitch;
	var mobileNavWrapper = null;
	var mobileNavCloseTrigger = null;
	var pageOverlay;

	var cloneMainNav = function() {
		// Find main nav
		var mainNavClone = $('.page-head nav.nav').clone();

		// Create a wrapper and clone the nav
		mobileNavWrapper = $('<div class="mobile-nav"></div>');
		var mainNavScroller = $('<div class="scroll"></div>');
		mainNavScroller.appendTo(mobileNavWrapper);
		var mainNavInner = $('<div class="inner"></div>');
		mainNavClone.appendTo(mainNavInner);
		mainNavInner.appendTo(mainNavScroller);

		// Create a close button and append it to the wrapper
		mobileNavCloseTrigger = $('<button class="close"><span>close</span></button>');
		mobileNavCloseTrigger.appendTo(mobileNavWrapper);

		mobileNavWrapper.appendTo('body');

		// Create and add overlay if no overlay
		if(pageOverlay.length == 0) {
			pageOverlay = $('<div class="page-overlay"></div>');
			pageOverlay.appendTo('body');
		}
	};

	NAV.init = function() {
		mobileNavSwitch = $('.page-head .mobile-menu button');
		pageOverlay = $('.page-overlay');

		cloneMainNav();

		$(mobileNavSwitch).on('click', function(e) {
			if(!(mobileNavWrapper.hasClass('open'))) {
				CORE.closeAllPanels();
				showMobileNav();
			}
			else {
				CORE.closeAllPanels();
			}

			e.preventDefault();
		});

		$(mobileNavCloseTrigger).on('click', function(e) {
			CORE.closeAllPanels();
			e.preventDefault();
		});

		// Escape button to the rescue for those who like to press it in a hope to close whatever is open
		$(document).keyup(function(e) {
			if (e.keyCode == 27) {
				CORE.closeAllPanels();
			}
		});

		$(pageOverlay).on('click', function(e) {
			CORE.closeAllPanels();
			e.preventDefault();
		});
	};

	NAV.resize = function() {
		CORE.closeAllPanels();
	};

	var showMobileNav = function() {
		mobileNavWrapper.addClass('show');
		CORE.pageBody.addClass('panel-open');
		CORE.pageBody.addClass('side-panel-open');
	};

	NAV.hideMobileNav = function() {
		if(!mobileNavWrapper.hasClass('show')) {
			return;
		}
		mobileNavWrapper.removeClass('show');
		CORE.pageBody.removeClass('side-panel-open');
	};

}( window.NAV = window.NAV || {}, jQuery ));

$(document).ready(function() {
	$(function() {
		$('a[href*="#"]:not([href="#"])').click(function() {
			if(!$(this).hasClass('scroll-to')) {
				return;
			}
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					// calculate offset
					var offset = 0;
					if(target.parents(".main-tabs").length) {
						var tabsWrapper = $(".tabs-tabs-wrapper.main");
						offset += tabsWrapper.outerHeight();
					}
					else {
						offset += $('.outer .top').outerHeight();
					}

					$('html, body').animate({
						scrollTop: (target.offset().top - offset)
					}, 1000);
					return false;
				}
			}
		});
	});
});