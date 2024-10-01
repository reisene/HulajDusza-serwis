/**
 * Initializes various functionalities on the webpage.
 *
 * @returns {void}
 */
$(document).ready(function () {
    // Initialize AOS
    AOS.init({
      duration: 1200,
    });
  
    // Menu toggle functionality
    const menu = $('nav.menu ul');
    const menuToggle = $('.menu-toggle');
    const menuIcon = $('.menu-icon');
    const closeIcon = $('.close-icon');
  
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
      if (!menu.is(event.target) && menu.has(event.target).length === 0 &&
          !menuToggle.is(event.target) && menuToggle.has(event.target).length === 0 && menu.hasClass('active')) {
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
    const currentUrl = window.location.href;
    const baseUrl = window.location.origin; // Get the base URL
  
    $('nav.menu ul li a').each(function () {
      const linkUrl = this.href;
  
      // Check if the link is to the homepage
      if (linkUrl === currentUrl ||
          (linkUrl === baseUrl + '/' && currentUrl === baseUrl + '/') ||
          (linkUrl === baseUrl + '/index.html' && (currentUrl === baseUrl + '/' || currentUrl === baseUrl + '/index.html'))) {
        $(this).parent().addClass('active');
      }
    });
  
    // Smooth scroll functionality for navigation links
    $('.smooth-scroll').click(function (e) {
      e.preventDefault();
      const target = $(this).attr('href');
      $('html, body').animate({
        scrollTop: $(target).offset().top
      }, 800);
    });
  
    // Sticky header and menu
    const stickyHeader = $('header');
    const stickyMenu = $('nav.menu');
    const sticky = stickyHeader.offset().top;
    const logo = $('.header-left img'); // Select your logo image
  
    function makeSticky() {
      const scrollTop = $(window).scrollTop();
      const stickyClass = scrollTop > sticky ? 'sticky' : '';
      stickyHeader.addClass(stickyClass);
      stickyMenu.addClass(stickyClass);
  
      // Logo and header scaling
      const maxLogoScale = 150; // Original width
      const minLogoScale = 100; // Reduced width in sticky state
      const maxScroll = 300; // Adjust this value to set when the scaling stops
  
      let logoWidth = maxLogoScale - (scrollTop / maxScroll) * (maxLogoScale - minLogoScale);
      logoWidth = Math.max(logoWidth, minLogoScale);
      logo.css('width', logoWidth + 'px');
  
      const maxPadding = 10; // Original padding top/bottom
      const minPadding = 5;  // Reduced padding in sticky state
  
      let headerPadding = maxPadding - (scrollTop / maxScroll) * (maxPadding - minPadding);
      
      if (headerPadding < minPadding) {headerPadding = minPadding}

      stickyHeader.css('padding', headerPadding + 'px 20px');
    }
  
    $(window).scroll(makeSticky);
  
    // Page title modification
    const originalTitle = document.title;
    const siteName = " - HulajDusza serwis hulajnóg elektrycznych";
    document.title = originalTitle + siteName;
  
    // Scroll to top button functionality
    const scrollToTopBtn = $("#scrollToTopBtn");
  
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
      const swUrl = '/js/service-worker.js';
      navigator.serviceWorker
        .register(swUrl)
        .then(({ scope }) => Sentry.captureMessage(`ServiceWorker registration successful with scope: ${scope}`, 'info'))
        .catch((error) => Sentry.captureException(error, {
  extra: {
    foo: 'bar',
  },
}));
    }
  
    // Element visibility check
    function isElementInView(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  
    // Tawk.to Script to initialize chat
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function(){
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/66ae13d81601a2195ba058ee/1i4bvr1p7';
      s1.charset = 'UTF-8'; //charset depreciated, only for compatibility
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  });
