// sticky-header.js
function getStickyHeader() {
    return $('header');
  }
  
  function getStickyMenu() {
    return $('nav.menu');
  }
  
  function getLogo() {
    return $('.header-left img');
  }
  
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
    
    if (headerPadding < minPadding) {headerPadding = minPadding}
  
    stickyHeader.css('padding', headerPadding + 'px 20px');
  }
  
  function initStickyHeader() {
    $(window).scroll(makeSticky);
  }
  
  export default initStickyHeader;