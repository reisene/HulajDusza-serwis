"use strict";

/**
 * This function initializes the share buttons functionality on a webpage.
 * It adds event listeners for toggling the visibility of the share buttons,
 * and hides the SMS share button on non-mobile devices.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Initializes and sets up a share panel.
  var a2a_config = a2a_config || {};
  a2a_config.templates = a2a_config.templates || {};
  a2a_config.onclick = false;
  a2a_config.locale = "pl";
  a2a_config.thanks = {
    postShare: true,
    ad: true
  };

  // Get references to the share buttons and toggle button elements
  var shareButtons = document.getElementById("share-buttons");
  var toggleButton = document.getElementById("toggle-share-buttons");

  /**
   * @description Toggles the visibility of a 'shareButtons' element, displaying it
   * when hidden and vice versa, while dynamically positioning it relative to a 'toggleButton'.
   */
  function toggleShareButtons() {
    if (shareButtons.style.display === "none" || shareButtons.style.display === "") {
      // Calculate the position of the button dynamically only when displaying
      var buttonRect = toggleButton.getBoundingClientRect();
      shareButtons.style.left = buttonRect.right + 0 + "px";
      shareButtons.style.display = "block";
    } else {
      shareButtons.style.display = "none";
    }
  }

  // Add event listener for clicking on the toggle button
  toggleButton.addEventListener("click", toggleShareButtons);

  // Add event listener for clicking outside the panel to hide it
  document.addEventListener("click", function (event) {
    // Handles document click events.
    var isClickInsidePanel = shareButtons.contains(event.target);
    var isClickOnToggleButton = toggleButton.contains(event.target);
    if (!isClickInsidePanel && !isClickOnToggleButton) {
      shareButtons.style.display = "none";
    }
  });

  // Check if the device supports touch events (likely mobile)
  if ("ontouchstart" in window || navigator.maxTouchPoints) {
    // Check if the device is mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Show the SMS share button on mobile devices
      document.querySelector(".a2a_button_sms").style.display = "block";
    }
  } else {
    // Hide the SMS share button on non-mobile devices
    document.querySelector(".a2a_button_sms").style.display = "none";
  }
});
//# sourceMappingURL=sharing-buttons.js.map
