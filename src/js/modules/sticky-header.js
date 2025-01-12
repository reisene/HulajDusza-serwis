// sticky-header.js

class StickyHeader {
  constructor() {
    this.stickyHeader = $('header');
    this.stickyMenu = $('nav.menu');
    this.logo = $('.header-left img');
  }

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

  init() {
    $(window).scroll(() => this.makeSticky());
  }
}

export default () => new StickyHeader().init();