"use strict";

/**
 * Initializes and animates counters when they become visible in the viewport.
 * The counters are identified by the 'counter' class and are animated using the 'initCounters' function.
 * The function also handles scroll events to trigger the counter animations.
 */
$(document).ready(function () {
  // Initializes counter elements with animation upon scrolling or loading.
  $('.timer').counterUp({
    delay: 10,
    time: 1000
  });

  /**
   * @description Initializes and starts a timer on every element with class `timer`.
   * It sets up an incrementing counter to reach the value specified in `data-to`
   * attribute, at a speed defined by `data-speed`, updating the element's text display
   * every 100 milliseconds.
   */
  var initCounters = function initCounters() {
    $('.timer').each(function () {
      // Initializes a timer.

      var countTo = parseInt($(this).attr('data-to'));
      var speed = parseInt($(this).attr('data-speed'));
      var count = 0;
      var increment = countTo / (speed / 100); // increment per step

      var $this = $(this);
      var counter = setInterval(function () {
        // Increments and updates text every second, stopping at a certain value.
        count += increment;
        if (count >= countTo) {
          count = countTo;
          clearInterval(counter);
        }
        $this.text(Math.floor(count));
      }, 100);
    });
  };
  var countersInitialized = new Set();

  /**
   * @description Iterates over elements with class "counter". It checks if each element
   * is visible within the viewport and has not been initialized before, then calls
   * `initCounters` to initialize it and adds it to a set for tracking initialization
   * status.
   */
  var handleCounters = function handleCounters() {
    $('.counter').each(function () {
      // Checks for elements in view and initializes them if not already initialized.

      if (isElementInView(this) && !countersInitialized.has(this)) {
        initCounters();
        countersInitialized.add(this);
      }
    });
  };

  /**
   * @description Triggers an execution of the `handleCounters` function every time a
   * scroll event occurs, enabling dynamic updates to counters or other variables based
   * on scrolling activity.
   */
  var handleScroll = function handleScroll() {
    handleCounters();
  };
  $(window).scroll(handleScroll);
  handleScroll(); // Initialize scroll animations and counters on load
});

/**
 * @description Checks if a given HTML element is currently visible within its parent's
 * viewport by comparing its bounding rectangle coordinates to the inner dimensions
 * of the window or document element. It returns true if the element is visible, false
 * otherwise.
 *
 * @param {HTMLElement} element - Checked for visibility within the viewport.
 *
 * @returns {boolean} True if the element is currently visible within the viewport
 * and false otherwise.
 */
function isElementInView(element) {
  var rect = element.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}