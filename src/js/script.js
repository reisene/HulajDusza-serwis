// script.js

import Menu from './modules/menu.js';
import initStickyHeader from './modules/sticky-header.js';

/**
 * @description Initializes and configures various components and services of a web
 * application, including animation, navigation, scrolling, and third-party integrations,
 * to provide a seamless user experience.
 */
class App {
  /**
   * @description Calls the `init` method, which presumably initializes the `App` object,
   * setting up its properties and state at the start of its lifecycle.
   */
  constructor() {
    this.init();
  }

  /**
   * @description Initializes various functionalities of the application, including
   * animations, menu, sticky header, scrolling, page title, and integration with
   * third-party services such as a service worker and live chat.
   */
  init() {
    this.initAOS();
    this.initMenu();
    initStickyHeader();
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
  initAOS() {
    AOS.init({
      duration: 1200,
    });
  }

  /**
   * @description Initializes a menu object, creating a new instance of the `Menu` class
   * and calling its `init` method to set up the menu.
   */
  initMenu() {
    const menu = new Menu();
    menu.init();
  }

  /**
   * @description Implements a smooth scrolling functionality for navigation links and
   * a scroll-to-top button. It prevents default link behavior, animates scrolling to
   * target elements, and toggles the visibility of the scroll-to-top button based on
   * the window's scroll position.
   */
  initScrollToTop() {
    const scrollToTopBtn = $("#scrollToTopBtn");

    // Smooth scroll functionality for navigation links
    $('.smooth-scroll').click((event) => {
      // Handles a click event on an element with the class 'smooth-scroll'.
      event.preventDefault();
      const target = $(event.target).attr('href');
      $('html, body').animate({
        scrollToTopBtn: $(target).offset().top
      }, 800);
    });

    $(window).scroll(() => {
      // Executes on every window scroll event.
      if ($(window).scrollTop() > 20) {
        scrollToTopBtn.addClass("show");
      } else {
        scrollToTopBtn.removeClass("show");
      }
    });

    scrollToTopBtn.click(() => {
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
  initIntersectionObserver() {
    const scrollElements = $('.fade-in');
    const observerOptions = {
      threshold: 0.25
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Executes when an entry intersects with the viewport.
        if (entry.isIntersecting) {
          $(entry.target).addClass('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollElements.each(element => {
      // Observes each element in the scrollElements array.
      observer.observe(element);
    });
  }

  /**
   * @description Checks if the browser supports service workers and, if so, waits for
   * the page to load before registering a service worker using the `registerServiceWorker`
   * method.
   */
  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', this.registerServiceWorker);
    }
  }

  /**
   * @description Registers a service worker with the specified URL. If registration
   * fails, it captures the error using a third-party error tracking service named
   * Sentry, providing additional context in the error report.
   */
  registerServiceWorker() {
    const swUrl = '/js/service-worker.js';
    navigator.serviceWorker
      .register(swUrl)
      .catch((error) => Sentry.captureException(error, {
        extra: {
          foo: 'bar',
        },
      }));
  }

  /**
   * @description Loads a third-party JavaScript library from the Tawk.to website to
   * enable live chat functionality on a webpage. The library is loaded asynchronously
   * from a CDN to improve page load times.
   */
  initTawkTo() {
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function(){
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
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
  initPageTitle() {
    const originalTitle = document.title;
    const siteName = " - HulajDusza serwis hulajnóg elektrycznych";
    document.title = originalTitle + siteName;
  }
}

$(document).on('DOMContentLoaded',() => {
  // Immediately executes when encountered.
  new App();
});