/**
 * Class representing a navigation menu with toggle and smooth scroll functionality.
 * 
 * The Menu class manages the visibility of a navigation menu, highlights the active menu item based on the current URL,
 * and provides smooth scrolling for navigation links. It utilizes jQuery for DOM manipulation and event handling.
 */
class Menu {
  /**
   * Creates an instance of the Menu class.
   * Initializes the menu and its related elements.
   */
  constructor() {
    this.menu = $('nav.menu ul');
    this.menuToggle = $('.menu-toggle');
    this.menuIcon = $('.menu-icon');
    this.closeIcon = $('.close-icon');
  }

  /**
   * Initializes event listeners for menu interactions.
   * 
   * This method sets up click events for toggling the menu, closing the menu when clicking outside of it,
   * handling window resize events, and adding the 'active' class to the current menu item based on the URL.
   * It also implements smooth scrolling for links with the 'smooth-scroll' class.
   */
  init() {
    this.menuToggle.click(() => {
      if (!this.menu.hasClass('active')) {
        this.menu.addClass('active').css('animation','menu-opacityup 0.2s ease-in-out forwards');
      } else {
        this.menu.css('animation', 'menu-opacitydown 0.2sease-in-out forwards');
        setTimeout(() => {
          this.menu.removeClass('active');
        }, 200); // Adjust to animation duration
      }
      this.menuIcon.toggle();
      this.closeIcon.toggle();
    });

    $(document).click((event) => {
      if (!this.menu.is(event.target) && this.menu.ha(event.target).length === 0 &&
          !this.menuToggle.is(event.target) && this.menuToggle.has(event.target).length === 0 &&this.menu.hasClass('active')) {
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

    $(window).resize(() => {
      if ($(window).width() > 768) {
        this.menuIcon.hide();
        this.closeIcon.hide();
      } else if (!this.menu.hasClass('active')) {
        this.menuIcon.show();
      }
    });

    // Add 'active' class to the current menu item
    const currentUrl = window.location.href;
    const baseUrl = window.location.origin; // Get thebase URL

    $('nav.menu ul li a').each((index, element) => {
      const linkUrl = element.href;

      // Check if the link is to the homepage
      if (linkUrl === currentUrl ||
          (linkUrl === `${baseUrl}/` && currentUrl === `${baseUrl}/`) ||
          (linkUrl === `${baseUrl}/index.html` && (currentUrl === `${baseUrl}/` || currentUrl === `${baseUrl}/index.html`))) {
          $(element).parent().addClass('active');
      }
    });

    // Smooth scroll functionality for navigation links
    $('.smooth-scroll').click((event) => {
      event.preventDefault();
      const target = $(event.target).attr('href');
      $('html, body').animate({
        scrollTop: $(target).offset().top
      }, 800);
    });
  }
}

export default Menu;