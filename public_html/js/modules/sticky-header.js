"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
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
  var stickyHeader = getStickyHeader();
  var stickyMenu = getStickyMenu();
  var logo = getLogo();
  var sticky = stickyHeader.offset().top;
  var scrollTop = $(window).scrollTop();
  var stickyClass = scrollTop > sticky ? 'sticky' : '';
  stickyHeader.addClass(stickyClass);
  stickyMenu.addClass(stickyClass);

  // Logo and header scaling
  var maxLogoScale = 150; // Original width
  var minLogoScale = 100; // Reduced width in sticky state
  var maxScroll = 300; // Adjust this value to set when the scaling stops

  var logoWidth = maxLogoScale - scrollTop / maxScroll * (maxLogoScale - minLogoScale);
  logoWidth = Math.max(logoWidth, minLogoScale);
  logo.css('width', logoWidth + 'px');
  var maxPadding = 10; // Original padding top/bottom
  var minPadding = 5; // Reduced padding in sticky state

  var headerPadding = maxPadding - scrollTop / maxScroll * (maxPadding - minPadding);
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
var _default = exports["default"] = initStickyHeader;