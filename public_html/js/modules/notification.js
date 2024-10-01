"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/**
 * @description Displays a notification to the user with a specified message and type,
 * adding it to the webpage and notifying screen readers. It removes the notification
 * after 5 seconds, allowing for customizable notifications.
 *
 * @param {string} message - Intended to display notification content.
 *
 * @param {string | 'success' | 'error'} type - Used to indicate the notification's
 * color scheme.
 */

function displayNotification(message, type) {
  var notification = document.getElementById("notification");
  var notificationMessage = document.getElementById("notification-message");

  // Make sure notification exists before attempting to modify it
  if (!notification || !notificationMessage) {
    console.error("Elementy notification lub notificationMessage nie istnieją");
    return;
  }

  // Make sure notification exists before attempting to modify it
  if (notification && notificationMessage) {
    notification.classList.add(type, 'show');
    notificationMessage.textContent = message;

    // Notify screen readers
    notification.setAttribute('aria-live', 'assertive');
    setTimeout(function () {
      // Waits then removes classes.
      notification.classList.remove('show', 'success', 'error');
    }, 5000);
  }
}
;
var _default = exports["default"] = displayNotification;