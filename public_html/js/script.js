"use strict";

var _stickyHeader = _interopRequireDefault(require("./modules/sticky-header.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Initializes various functionalities on the webpage.
 *
 * @returns {void}
 */

$(document).ready(function () {
  // Initialize AOS
  AOS.init({
    duration: 1200
  });

  // Menu toggle functionality
  var menu = $('nav.menu ul');
  var menuToggle = $('.menu-toggle');
  var menuIcon = $('.menu-icon');
  var closeIcon = $('.close-icon');
  menuToggle.click(function () {
    if (!menu.hasClass('active')) {
      menu.addClass('active').css('animation', 'menu-opacityup 0.2s ease-in-out forwards');
    } else {
      menu.css('animation', 'menu-opacitydown 0.2s ease-in-out forwards');
      setTimeout(function () {
        menu.removeClass('active');
      }, 200); // Adjust to animation duration
    }
    menuIcon.toggle();
    closeIcon.toggle();
  });

  // Close menu when clicked outside
  $(document).click(function (event) {
    if (!menu.is(event.target) && menu.has(event.target).length === 0 && !menuToggle.is(event.target) && menuToggle.has(event.target).length === 0 && menu.hasClass('active')) {
      menu.css('animation', 'menu-opacitydown 0.2s ease-in-out forwards');
      setTimeout(function () {
        menu.removeClass('active');
        closeIcon.hide();
        if ($(window).width() <= 768) {
          menuIcon.show();
        }
      }, 200); // Adjust to animation duration
    }
  });

  // Adjust menu icons based on window size
  $(window).resize(function () {
    if ($(window).width() > 768) {
      menuIcon.hide();
      closeIcon.hide();
    } else if (!menu.hasClass('active')) {
      menuIcon.show();
    }
  });

  // Add 'active' class to the current menu item
  var currentUrl = window.location.href;
  var baseUrl = window.location.origin; // Get the base URL

  $('nav.menu ul li a').each(function () {
    var linkUrl = this.href;

    // Check if the link is to the homepage
    if (linkUrl === currentUrl || linkUrl === baseUrl + '/' && currentUrl === baseUrl + '/' || linkUrl === baseUrl + '/index.html' && (currentUrl === baseUrl + '/' || currentUrl === baseUrl + '/index.html')) {
      $(this).parent().addClass('active');
    }
  });

  // Smooth scroll functionality for navigation links
  $('.smooth-scroll').click(function (e) {
    e.preventDefault();
    var target = $(this).attr('href');
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 800);
  });
  (0, _stickyHeader["default"])();

  // Page title modification
  var originalTitle = document.title;
  var siteName = " - HulajDusza serwis hulajnóg elektrycznych";
  document.title = originalTitle + siteName;

  // Scroll to top button functionality
  var scrollToTopBtn = $("#scrollToTopBtn");
  $(window).scroll(function () {
    if ($(this).scrollTop() > 20) {
      scrollToTopBtn.addClass("show");
    } else {
      scrollToTopBtn.removeClass("show");
    }
  });
  scrollToTopBtn.click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 'smooth');
  });

  // Scroll animations with Intersection Observer
  var scrollElements = $('.fade-in');
  var observerOptions = {
    threshold: 0.25
  };
  var observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        $(entry.target).addClass('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  scrollElements.each(function () {
    observer.observe(this);
  });

  // Service worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', registerServiceWorker);
  }

  /**
   * Registers the service worker.
   */
  function registerServiceWorker() {
    var swUrl = '/js/service-worker.js';
    navigator.serviceWorker.register(swUrl)["catch"](function (error) {
      return Sentry.captureException(error, {
        extra: {
          foo: 'bar'
        }
      });
    });
  }

  // Element visibility check
  function isElementInView(element) {
    var rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }

  // Tawk.to Script to initialize chat
  var Tawk_API = Tawk_API || {},
    Tawk_LoadStart = new Date();
  (function () {
    var s1 = document.createElement("script"),
      s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/66ae13d81601a2195ba058ee/1i4bvr1p7';
    s1.charset = 'UTF-8'; //charset depreciated, only for compatibility
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
  })();
});