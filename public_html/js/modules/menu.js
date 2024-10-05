"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * @description Handles menu interactions and animations, including toggling the menu,
 * handling outside clicks, window resizing, and adding an 'active' class to the
 * current menu item based on the URL.
 */
class Menu {
  /**
   * @description Initializes the object's properties by selecting and storing DOM
   * elements using jQuery. The properties are:
   * - `menu`: a list of menu items within a navigation bar,
   * - `menuToggle`: an element to toggle the menu,
   * - `menuIcon`: an icon related to the menu,
   * - `closeIcon`: an icon to close the menu.
   */
  constructor() {
    this.menu = $('nav.menu ul');
    this.menuToggle = $('.menu-toggle');
    this.menuIcon = $('.menu-icon');
    this.closeIcon = $('.close-icon');
  }

  /**
   * @description Handles the initialization of the menu functionality, including
   * toggling the menu, handling click events outside the menu, resizing the menu, and
   * adding an 'active' class to the current menu item based on the current URL.
   */
  init() {
    this.handleMenuToggle();
    this.handleDocumentClick();
    this.handleWindowResize();
    this.addActiveClassToMenuItem();
  }
  handleMenuToggle() {
    this.menuToggle.click(() => {
      if (!this.menu.hasClass('active')) {
        this.menu.addClass('active').css('animation', 'menu-opacityup 0.2s ease-in-out forwards');
      } else {
        this.menu.css('animation', 'menu-opacitydown 0.2s ease-in-out forwards');
        setTimeout(() => {
          this.menu.removeClass('active');
        }, 200); // Adjust to animation duration
      }
      this.menuIcon.toggle();
      this.closeIcon.toggle();
    });
  }
  handleDocumentClick() {
    $(document).click(event => {
      if (!this.menu.is(event.target) && this.menu.has(event.target).length === 0 && !this.menuToggle.is(event.target) && this.menuToggle.has(event.target).length === 0 && this.menu.hasClass('active')) {
        this.menu.css('animation', 'menu-opacitydown 0.2sease-in-out forwards');
        setTimeout(() => {
          this.menu.removeClass('active');
          this.closeIcon.hide();
          if ($(window).width() <= 768) {
            this.menuIcon.show();
          }
        }, 200); // Adjust to animation duration
      }
    });
  }
  handleWindowResize() {
    $(window).resize(() => {
      if ($(window).width() > 768) {
        this.menuIcon.hide();
        this.closeIcon.hide();
      } else if (!this.menu.hasClass('active')) {
        this.menuIcon.show();
      }
    });
  }
  addActiveClassToMenuItem() {
    const currentUrl = window.location.href;
    const baseUrl = window.location.origin; // Get thebase URL

    $('nav.menu ul li a').each((index, element) => {
      const linkUrl = element.href;

      // Check if the link is to the homepage
      if (linkUrl === currentUrl || linkUrl === `${baseUrl}/` && currentUrl === `${baseUrl}/` || linkUrl === `${baseUrl}/index.html` && (currentUrl === `${baseUrl}/` || currentUrl === `${baseUrl}/index.html`)) {
        $(element).parent().addClass('active');
      }
    });
  }
}
var _default = exports.default = Menu;