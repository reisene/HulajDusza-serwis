// script.js

import Menu from './modules/menu.js';
import initStickyHeader from './modules/sticky-header.js';

class App {
  constructor() {
    this.init();
  }

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

  initAOS() {
    AOS.init({
      duration: 1200,
    });
  }

  initMenu() {
    const menu = new Menu();
    menu.init();
  }

  initScrollToTop() {
    const scrollToTopBtn = $("#scrollToTopBtn");

    $(window).scroll(() => {
      if ($(window).scrollTop() > 20) {
        scrollToTopBtn.addClass("show");
      } else {
        scrollToTopBtn.removeClass("show");
      }
    });

    scrollToTopBtn.click(() => {
      $('html, body').animate({
        scrollTop: 0
      }, 'smooth');
    });
  }

  initIntersectionObserver() {
    const scrollElements = $('.fade-in');
    const observerOptions = {
      threshold: 0.25
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $(entry.target).addClass('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollElements.each(element => {
      observer.observe(element);
    });
  }

  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', this.registerServiceWorker);
    }
  }

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

  initPageTitle() {
    const originalTitle = document.title;
    const siteName = " - HulajDusza serwis hulajnóg elektrycznych";
    document.title = originalTitle + siteName;
  }
}

$(document).ready(() => {
  new App();
});