/**
 * Class representing a sticky header.
 */
class StickyHeader {
  /**
   * Create a sticky header.
   * Initializes the sticky header, menu, and logo elements.
   */
  constructor() {
    this.stickyHeader = $('header');
    this.stickyMenu = $('nav.menu');
    this.logo = $('.header-left img');
  }

  /**
   * Makes the header sticky based on scroll position.
   * Adds or removes 'sticky' class to header and menu.
   * Scales the logo and adjusts header padding based on scroll position.
   */
  makeSticky() {
    const sticky = this.stickyHeader.offset().top;
    const scrollTop = $(window).scrollTop();
    if (scrollTop > sticky) {
      this.stickyHeader.addClass('sticky');
      this.stickyMenu.addClass('sticky');
    } else if (scrollTop === 0) {
      this.stickyHeader.removeClass('sticky');
      this.stickyMenu.removeClass('sticky');
    }

    // Logo and header scaling
    const maxLogoScale = 150; // Original width
    const minLogoScale = 100; // Reduced width in sticky state
    const maxScroll = 300; // Adjust this value to set when the scaling stops

    let logoWidth = maxLogoScale - (scrollTop / maxScroll) * (maxLogoScale - minLogoScale);
    logoWidth = Math.max(logoWidth, minLogoScale);
    this.logo.css('width', logoWidth + 'px');

    const maxPadding = 10; // Original padding top/bottom
    const minPadding = 5;  // Reduced padding in sticky state

    let headerPadding = maxPadding - (scrollTop / maxScroll) * (maxPadding - minPadding);
    headerPadding = Math.max(headerPadding, minPadding);

    this.stickyHeader.css('padding', headerPadding + 'px 20px');
  }

  /**
   * Initializes the sticky header functionality.
   * Attaches a scroll event listener to the window.
   */
  init() {
    $(window).on('scroll',() => this.makeSticky());
  }
}

export default () => new StickyHeader().init();
