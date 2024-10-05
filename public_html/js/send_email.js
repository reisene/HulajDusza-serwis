"use strict";

var _notification = _interopRequireDefault(require("./modules/notification.js"));
var _phone_format = _interopRequireDefault(require("./modules/phone_format.js"));
var _buttonAnimation = _interopRequireDefault(require("./modules/button-animation.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Handles form submission, validates input, and sends data to the server using AJAX.
 *
 * @param {Event} event - The submit event triggered by the form.
 * @param {string} token - The reCAPTCHA token obtained after user interaction.
 * @returns {void}
 */

(0, _phone_format.default)();
const {
  animateButton,
  resetButton
} = (0, _buttonAnimation.default)();
const form = document.getElementById("my-form");

/**
 * @description Processes a form submission, validating user input and sending it to
 * a PHP script via an AJAX request. It also displays notifications, resets the form
 * after success, and re-enables the submit button upon completion or failure.
 *
 * @param {Event} event - Used to prevent default form submission behavior.
 *
 * @param {string} token - Used to authenticate reCAPTCHA responses.
 */
async function handleSubmit(event, token) {
  event.preventDefault();

  // Check if form exists before continuing
  if (!form) {
    console.error("Form not found.");
    return;
  }
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  const formData = {
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value.replace(/\D/g, ''),
    name: document.getElementById("name").value,
    message: document.getElementById("message").value
  };
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobilePhonePattern = /^[0-9]{9}$/; // Polish mobile phone number pattern: 9 digits

  if (!formData.email && !formData.phone) {
    (0, _notification.default)("Proszę podać adres email lub numer telefonu.", 'error');
    return;
  }
  if (formData.email && !emailPattern.test(formData.email)) {
    (0, _notification.default)("Proszę podać prawidłowy adres email.", 'error');
    return;
  }
  if (formData.phone && !mobilePhonePattern.test(formData.phone)) {
    (0, _notification.default)("Proszę podać prawidłowy numer telefonu (9 cyfr).", 'error');
    return;
  }
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    submitButton.disabled = true;
  }
  const uniqueID = `${Date.now()}${Math.floor(Math.random() * 1000000).toString(36)}`;

  // Prepare data for sending
  const data = new FormData();
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('phone', formData.phone);
  data.append('message', formData.message);
  data.append('g-recaptcha-response', token);
  data.append('uniqueID', uniqueID);

  // Send data to PHP
  try {
    const response = await fetch('/php/send_email.php', {
      method: 'POST',
      body: data
    });
    const result = await response.json();
    if (result.success) {
      (0, _notification.default)(result.message, 'success');
      setTimeout(() => {
        // Calls animateButton with 'success'.
        animateButton('success');
      }, 0);
      setTimeout(() => {
        // Calls form.reset() with a delay.
        form.reset(); // Reset the form after success
      }, 5000); // Delaying reset after success message
    } else {
      (0, _notification.default)(result.message, 'error');
      setTimeout(() => {
        // Immediately invokes itself.
        animateButton('error');
      }, 0);
    }
  } catch (error) {
    console.error("Form submission error:", error.message, error.stack);
    (0, _notification.default)("Ups! Wystąpił problem z przesłaniem formularza", 'error');
  } finally {
    // Re-enable the submit button
    submitButton.disabled = false;
    setTimeout(() => {
      // Calls `resetButton` after 5 seconds delay.
      resetButton();
    }, 5000);
  }
}
form.addEventListener("submit", function (event) {
  // Handles form submission events.
  event.preventDefault();
  grecaptcha.ready(function () {
    // Executes reCAPTCHA and handles its response.
    grecaptcha.execute('6LeTFCAqAAAAAKlvDJZjZnVCdtD76hc3YZiIUs_Q', {
      action: 'submit'
    }).then(function (token) {
      // Handles ReCAPTCHA responses.
      if (token) {
        handleSubmit(event, token);
      } else {
        (0, _notification.default)("ReCAPTCHA verification failed. Please try again.", 'error');
      }
    }).catch(function (error) {
      // Catches ReCAPTCHA errors.
      console.error("ReCAPTCHA error:", error);
      (0, _notification.default)("ReCAPTCHA verification failed. Please try again.", 'error');
    });
  });
});