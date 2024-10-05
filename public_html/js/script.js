"use strict";

var _menu = _interopRequireDefault(require("./modules/menu.js"));
var _stickyHeader = _interopRequireDefault(require("./modules/sticky-header.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // script.js
/**
 * @description Initializes and configures various components and services of a web
 * application, including animation, navigation, scrolling, and third-party integrations,
 * to provide a seamless user experience.
 */
var App = /*#__PURE__*/function () {
  /**
   * @description Calls the `init` method, which presumably initializes the `App` object,
   * setting up its properties and state at the start of its lifecycle.
   */
  function App() {
    _classCallCheck(this, App);
    this.init();
  }

  /**
   * @description Initializes various functionalities of the application, including
   * animations, menu, sticky header, scrolling, page title, and integration with
   * third-party services such as a service worker and live chat.
   */
  return _createClass(App, [{
    key: "init",
    value: function init() {
      this.initAOS();
      this.initMenu();
      (0, _stickyHeader["default"])();
      this.initScrollToTop();
      this.initIntersectionObserver();
      this.initServiceWorker();
      this.initTawkTo();
      this.initPageTitle();
    }

    /**
     * @description Initializes the AOS (Animate on Scroll) library with a specified
     * duration of 1200 milliseconds for animations.
     */
  }, {
    key: "initAOS",
    value: function initAOS() {
      AOS.init({
        duration: 1200
      });
    }

    /**
     * @description Initializes a menu object, creating a new instance of the `Menu` class
     * and calling its `init` method to set up the menu.
     */
  }, {
    key: "initMenu",
    value: function initMenu() {
      var menu = new _menu["default"]();
      menu.init();
    }

    /**
     * @description Implements a smooth scrolling functionality for navigation links and
     * a scroll-to-top button. It prevents default link behavior, animates scrolling to
     * target elements, and toggles the visibility of the scroll-to-top button based on
     * the window's scroll position.
     */
  }, {
    key: "initScrollToTop",
    value: function initScrollToTop() {
      var scrollToTopBtn = $("#scrollToTopBtn");

      // Smooth scroll functionality for navigation links
      $('.smooth-scroll').click(function (event) {
        // Handles a click event on an element with the class 'smooth-scroll'.
        event.preventDefault();
        var target = $(event.target).attr('href');
        $('html, body').animate({
          scrollToTopBtn: $(target).offset().top
        }, 800);
      });
      $(window).scroll(function () {
        // Executes on every window scroll event.
        if ($(window).scrollTop() > 20) {
          scrollToTopBtn.addClass("show");
        } else {
          scrollToTopBtn.removeClass("show");
        }
      });
      scrollToTopBtn.click(function () {
        // Scrolls the webpage to the top smoothly.
        $('html, body').animate({
          scrollTop: 0
        }, 'smooth');
      });
    }

    /**
     * @description Observes elements with the class 'fade-in' for intersection with the
     * viewport. When an element intersects, it adds the class 'visible' to it and stops
     * observing the element. This functionality is achieved using the IntersectionObserver
     * API.
     */
  }, {
    key: "initIntersectionObserver",
    value: function initIntersectionObserver() {
      var scrollElements = $('.fade-in');
      var observerOptions = {
        threshold: 0.25
      };
      var observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          // Executes when an entry intersects with the viewport.
          if (entry.isIntersecting) {
            $(entry.target).addClass('visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      scrollElements.each(function (element) {
        // Observes each element in the scrollElements array.
        observer.observe(element);
      });
    }

    /**
     * @description Checks if the browser supports service workers and, if so, waits for
     * the page to load before registering a service worker using the `registerServiceWorker`
     * method.
     */
  }, {
    key: "initServiceWorker",
    value: function initServiceWorker() {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', this.registerServiceWorker);
      }
    }

    /**
     * @description Registers a service worker with the specified URL. If registration
     * fails, it captures the error using a third-party error tracking service named
     * Sentry, providing additional context in the error report.
     */
  }, {
    key: "registerServiceWorker",
    value: function registerServiceWorker() {
      var swUrl = '/js/service-worker.js';
      navigator.serviceWorker.register(swUrl)["catch"](function (error) {
        return Sentry.captureException(error, {
          extra: {
            foo: 'bar'
          }
        });
      });
    }

    /**
     * @description Loads a third-party JavaScript library from the Tawk.to website to
     * enable live chat functionality on a webpage. The library is loaded asynchronously
     * from a CDN to improve page load times.
     */
  }, {
    key: "initTawkTo",
    value: function initTawkTo() {
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
    }

    /**
     * @description Appends a site name to the existing document title, resulting in a
     * modified title that includes the original title and the site name. The site name
     * is hardcoded as " - HulajDusza serwis hulajnóg elektrycznych".
     */
  }, {
    key: "initPageTitle",
    value: function initPageTitle() {
      var originalTitle = document.title;
      var siteName = " - HulajDusza serwis hulajnóg elektrycznych";
      document.title = originalTitle + siteName;
    }
  }]);
}();
$(document).ready(function () {
  // Immediately executes when encountered.
  new App();
});
//# sourceMappingURL=script.js.map
