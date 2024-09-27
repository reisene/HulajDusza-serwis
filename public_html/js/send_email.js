/**
 * Handles form submission, validates input, and sends data to the server using AJAX.
 *
 * @param {Event} event - The submit event triggered by the form.
 * @param {string} token - The reCAPTCHA token obtained after user interaction.
 * @returns {void}
 */

import phoneFormatter from './phone_format.js';
phoneFormatter();

const form = $("#my-form");

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
  if (!form.length) {
    console.error("Form not found.");
    return;
  }
  
  const notification = $("#notification");
  const notificationMessage = $("#notification-message");
  const formData = {
    email: $("#email").val().trim(),
    phone: $("#phone").val().replace(/\D/g, ''),
    name: $("#name").val().trim(),
    message: $("#message").val().trim()
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

  const submitButton = form.find('button[type="submit"]');
  if (submitButton.length) {
    submitButton.prop('disabled', true);
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
    const response = await $.ajax({
      type: 'POST',
      url: '/php/send_email.php',
      data: data,
      contentType: false,
      processData: false
    });

    const result = response;

    if (result.success) {
      displayNotification(result.message, 'success');
      setTimeout(() => {
        form[0].reset(); // Reset the form after success
      }, 5000); // Delaying reset after success message
    } else {
      displayNotification(result.message, 'error');
    }
  } catch (error) {
    console.error("Form submission error:", error);
    displayNotification("Ups! Wystąpił problem z przesłaniem formularza", 'error');
  } finally {
    // Re-enable the submit button
    if (submitButton.length) {
      submitButton.prop('disabled', false);
    }
  }
}

form.on("submit", async function(event) {
  event.preventDefault();

  try {
    const token = await grecaptcha.execute('6LeTFCAqAAAAAKlvDJZjZnVCdtD76hc3YZiIUs_Q', { action: 'submit' });

    if (token) {
      handleSubmit(event, token);
    } else {
      displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
    }
  } catch (error) {
    console.error("ReCAPTCHA error:", error);
    displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
  }
});

/**
 * @description Displays a notification to the user, indicating that it takes two
 * parameters: `message` and `type`. It adds the message and type to an existing HTML
 * element, notifies screen readers, and automatically hides the notification after
 * 5 seconds.
 *
 * @param {string} message - Displayed to the user as notification content.
 *
 * @param {string} type - Used to specify notification style.
 */
function displayNotification(message, type) {
  const notification = $("#notification");
  const notificationMessage = $("#notification-message");

  if (notification.length && notificationMessage.length) {
    // Add the notification type and show classes
    notification.addClass(type).addClass('show');

    // Update the notification message
    notificationMessage.text(message);

    // Notify screen readers
    notification.attr('aria-live', 'assertive');

    setTimeout(() => {
      notification.removeClass('show', 'success', 'error');
      
    }, 5000);
  }
}