/**
 * Handles form submission, validates input, and sends data to the server using AJAX.
 *
 * @param {Event} event - The submit event triggered by the form.
 * @param {string} token - The reCAPTCHA token obtained after user interaction.
 * @returns {void}
 */
import displayNotification from './modules/notification.js';
import phoneFormatter from './modules/phone_format.js';

phoneFormatter();

const form = document.getElementById("my-form");

/**
 * @description Processes a form submission asynchronously, validating user input and
 * sending data to a PHP script for email or phone notification. It handles errors,
 * displays notifications, and resets the form after successful submission.
 *
 * @param {Event} event - Used to prevent form submission.
 *
 * @param {string} token - Used for Google reCAPTCHA validation.
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
    displayNotification("Proszę podać adres email lub numer telefonu.", 'error');
    return;
  }

  if (formData.email && !emailPattern.test(formData.email)) {
    displayNotification("Proszę podać prawidłowy adres email.", 'error');
    return;
  }

  if (formData.phone && !mobilePhonePattern.test(formData.phone)) {
    displayNotification("Proszę podać prawidłowy numer telefonu (9 cyfr).", 'error');
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
      body: data,
    });
  
    const result = await response.json();
  
    if (result.success) {
      displayNotification(result.message, 'success');
      setTimeout(() => {
        form.reset(); // Reset the form after success
      }, 5000); // Delaying reset after success message
    } else {
      displayNotification(result.message, 'error');
    }
  } catch (error) {
    console.error("Form submission error:", error.message, error.stack);
    displayNotification("Ups! Wystąpił problem z przesłaniem formularza", 'error');
  } finally {
    // Re-enable the submit button
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

form.addEventListener("submit", function(event) {
  // Listens for form submission.
  event.preventDefault();
  grecaptcha.ready(function() {
      // Executes a reCAPTCHA challenge and handles its result.
      grecaptcha.execute('6LeTFCAqAAAAAKlvDJZjZnVCdtD76hc3YZiIUs_Q', {action: 'submit'})
      .then(function(token) {
          // Handles ReCAPTCHA response.
          if (token) {
              handleSubmit(event, token);
          } else {
              displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
          }
      })
      .catch(function(error) {
          // Catches errors.
          console.error("ReCAPTCHA error:", error);
          displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
      });
  });
})
