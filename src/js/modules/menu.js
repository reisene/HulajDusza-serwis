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
  
  /**
   * Handles the toggling of the menu, including animation and icon display.
   *
   * @function handleMenuToggle
   * @memberof Menu
   * @instance
   * @listens click
   * @fires Menu#menu-toggle
   * @fires Menu#menu-icon
   * @fires Menu#close-icon
   * @fires Menu#menu
   * @fires Menu#animation
   * @fires Menu#setTimeout
   * @fires Menu#toggle
   */
  handleMenuToggle() {
    this.menuToggle.on('click', () => {
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

  
  /**
   * Handles the document click event to close the menu when clicking outside of it.
   *
   * @function handleDocumentClick
   * @memberof Menu
   * @instance
   * @listens click
   * @fires Menu#menu
   * @fires Menu#menuToggle
   * @fires Menu#closeIcon
   * @fires Menu#menuIcon
   * @fires Menu#window
   * @fires Menu#setTimeout
   * @fires Menu#toggle
   * @fires Menu#css
   * @fires Menu#hasClass
   * @fires Menu#width
   * @fires Menu#show
   * @param {Event} event - The click event object.
   */
  handleDocumentClick() {
    $(document).on('click', (event) => {
      if (!this.menu.is(event.target) && this.menu.has(event.target).length === 0 &&
          !this.menuToggle.is(event.target) && this.menuToggle.has(event.target).length === 0 && this.menu.hasClass('active')) {
        this.menu.css('animation', 'menu-opacitydown 0.2s ease-in-out forwards');
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

  
  /**
   * Handles the window resize event to adjust the menu icon display based on the window width.
   *
   * @function handleWindowResize
   * @memberof Menu
   * @instance
   * @listens resize
   * @fires Menu#window
   * @fires Menu#width
   * @fires Menu#menuIcon
   * @fires Menu#closeIcon
   * @fires Menu#hasClass
   * @fires Menu#hide
   * @fires Menu#show
   */
  handleWindowResize() {
    $(window).on('resize', () => {
      if ($(window).width() > 768) {
        this.menuIcon.hide();
        this.closeIcon.hide();
      } else if (!this.menu.hasClass('active')) {
        this.menuIcon.show();
      }
    });
  }

  
  /**
   * Adds an 'active' class to the current menu item based on the current URL.
   *
   * @function addActiveClassToMenuItem
   * @memberof Menu
   * @instance
   * @fires Menu#window
   * @fires Menu#location
   * @fires Menu#href
   * @fires Menu#origin
   * @fires Menu#nav.menu
   * @fires Menu#ul
   * @fires Menu#li
   * @fires Menu#a
   * @fires Menu#parent
   * @fires Menu#addClass
   * @param {string} [currentUrl=window.location.href] - The current URL of the page.
   * @param {string} [baseUrl=window.location.origin] - The base URL of the page.
   * @returns {void}
   */
  addActiveClassToMenuItem() {
    const currentUrl = window.location.href;
    const baseUrl = window.location.origin; // Get the base URL

    $('nav.menu ul li a').each((index, element) => {
      const linkUrl = element.href;

      // Check if the link is to the homepage
      if (linkUrl === currentUrl ||
          (linkUrl === `${baseUrl}/` && currentUrl === `${baseUrl}/`) ||
          (linkUrl === `${baseUrl}/index.html` && (currentUrl === `${baseUrl}/` || currentUrl === `${baseUrl}/index.html`))) {
          $(element).parent().addClass('active');
      }
    });
  }

}

export default Menu;