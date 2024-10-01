/**
 * @description Returns a jQuery object referencing the HTML element with the tag
 * name 'header'.
 *
 * @returns {object} The jQuery object representing the HTML element with the tag
 * name 'header'.
 */
function getStickyHeader() {
    return $('header');
  }
  
  /**
   * @description Returns a jQuery object representing an HTML element with the class
   * `menu` that is a descendant of an element with the tag name `nav`.
   *
   * @returns {object} A jQuery object referencing an HTML element with the tag name
   * 'nav' and class 'menu'.
   */
  function getStickyMenu() {
    return $('nav.menu');
  }
  
  /**
   * @description Returns a jQuery object containing the first img element within the
   * element with the class `header-left` in the DOM.
   *
   * @returns {object} A jQuery object containing the DOM element(s) that match the CSS
   * selector '.header-left img', specifically an image element.
   */
  function getLogo() {
    return $('.header-left img');
  }
  
  /**
   * @description Adjusts the layout of a sticky header and menu when scrolling. It
   * adds a 'sticky' class to the header and menu, scales the logo and adjusts the
   * header padding based on the scroll position.
   */
  function makeSticky() {
    const stickyHeader = getStickyHeader();
    const stickyMenu = getStickyMenu();
    const logo = getLogo();
    const sticky = stickyHeader.offset().top;
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
    
    headerPadding = Math.max(headerPadding, minPadding);
  
    stickyHeader.css('padding', headerPadding + 'px 20px');
  }
  
  /**
   * @description Binds the `makeSticky` function to the window's scroll event, ensuring
   * the function is executed every time the window is scrolled.
   */
  function initStickyHeader() {
    $(window).scroll(makeSticky);
  }
  
  export default initStickyHeader;