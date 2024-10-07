/**
 * Handles form submission, validates input, and sends data to the server using AJAX.
 *
 * @param {Event} event - The submit event triggered by the form.
 * @param {string} token - The reCAPTCHA token obtained after user interaction.
 * @returns {void}
 */
import displayNotification from './modules/notification.js';
import phoneFormatter from './modules/phone_format.js';
import initButtonAnimation from './modules/button-animation.js';

phoneFormatter();

const { animateButton, resetButton } = initButtonAnimation();

const form = document.getElementById("my-form");

// Pobierz token z generate-token.php
fetch('/php/generate-token.php')
  .then(response => response.text())
  .then(csrfToken => {
    // Zapisz token w lokalnym storage
    localStorage.setItem('csrf_token', csrfToken);

    // Dodaj token do formularza
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = 'csrf_token';
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);
  })
  .catch(error => {
    const errorData = {
      message: 'Błąd pobierania tokena',
      url: '/php/generate-token.php',
      method: 'GET',
    };
    Sentry.captureException(new Error(errorData.message), {
      extra: errorData,
    });
    console.error('Błąd pobierania tokena:', error)
  });

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
  
  // Get form data
  const formData = {
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value.replace(/\D/g, ''),
    name: document.getElementById("name").value,
    message: document.getElementById("message").value
  };

  if (!validateFormData(formData)) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
      submitButton.disabled = true;
  }

  const uniqueID = `${Date.now()}${Math.floor(Math.random() * 1000000).toString(36)}`;

  const csrfToken = localStorage.getItem('csrf_token');

  // Prepare data for sending
  const data = new FormData();
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('phone', formData.phone);
  data.append('message', formData.message);
  data.append('g-recaptcha-response', token);
  data.append('uniqueID', uniqueID);
  data.append('csrf_token', csrfToken);

  const file = new File([JSON.stringify(formData)], 'form_data.json', {
    type: 'application/json',
  });

  await sendDataToServer(submitButton, data, file);
}

form.addEventListener("submit", (event) => {
  // Handles form submission events.
  event.preventDefault();
  grecaptcha.ready(() => {
      // Executes reCAPTCHA and handles its response.
      grecaptcha.execute('6LeTFCAqAAAAAKlvDJZjZnVCdtD76hc3YZiIUs_Q', {action: 'submit'})
      .then((token) => {
          // Handles ReCAPTCHA responses.
          if (token) {
              handleSubmit(event, token);
          } else {
              displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
          }
      })
      .catch((error) => {
          // Catches ReCAPTCHA errors.
          console.error("ReCAPTCHA error:", error);
          displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
      });
  });
})

/**
 * Validates form data before sending it to the server.
 *
 * @param {Object} formData - Object containing form data.
 *
 * @returns {boolean} - Returns true if form data is valid, false otherwise.
 */

function validateFormData(formData) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobilePhonePattern = /^[0-9]{9}$/; // Polish mobile phone pattern: 9 digits

  if (!formData.email && !formData.phone) {
    displayNotification("Proszę podać adres email lub numer telefonu.", 'error');
    return false;
  }

  if (formData.email && !emailPattern.test(formData.email)) {
    displayNotification("Proszę podać prawidłowy adres email.", 'error');
    return false;
  }

  if (formData.phone && !mobilePhonePattern.test(formData.phone)) {
    displayNotification("Proszę podać prawidłowy numer telefonu (9 cyfr).", 'error');
    return false;
  }
  return true;
}

/**
 * @description Sends form data to a PHP script using the Fetch API. It processes
 * the response, displaying notifications based on the result. It also resets the
 * form after success, re-enables the submit button upon completion, and handles
 * errors gracefully.
 *
 * @param {HTMLElement} submitButton - The form's submit button element.
 * @param {FormData} data - An object containing form data to be sent to the server.
 * @returns {Promise<void>}
 */
async function sendDataToServer(submitButton, data, file) {
  try {
    const response = await fetch('/php/send_email.php', {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      throw new Error(`Błąd ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
  
    if (result.success) {
      displayNotification(result.message, 'success');
      setTimeout(() => {
        // Calls animateButton with 'success'.
        animateButton('success');
      }, 0);
      setTimeout(() => {
        // Calls form.reset() with a delay.
        form.reset(); // Reset the form after success
      }, 5000); // Delaying reset after success message
    } else {
      displayNotification(result.message, 'error');
      setTimeout(() => {
        // Immediately invokes itself.
        animateButton('error');
      }, 0);
    }
  } catch (error) {
    console.error("Form submission error:", error.message, error.stack);
    handleError(file, error);
  } finally {
    // Re-enable the submit button
    submitButton.disabled = false;
    setTimeout(() => {
      // Calls `resetButton` after 5 seconds delay.
      resetButton ();
    }, 5000);
  }
}

/**
 * Captures and handles errors by reporting them to Sentry and notifying the user.
 *
 * This function utilizes Sentry's `captureException` to log the provided error along with 
 * additional context, such as form data and specific tags. It also displays a user-friendly 
 * error message to inform the user of the encountered issue.
 *
 * @param {Error} error - The error object to be captured and reported.
 * @param {Object} data - The form data associated with the error (should be defined in the scope).
 * @param {Object} [options] - Optional parameters for additional context.
 * @param {string} options.formName - The name of the form where the error occurred, used for tagging.
 * 
 * @tags {Object} tags - Tags to categorize the error.
 * @tags.form-name {string} 'kontakt' - The name of the form that triggered the error, aiding in filtering and analysis.
 */
function handleError(file, error) {
  Sentry.captureException(error, {
    attachments: [
      {
        filename: 'form_data.json',
        data: file,
        contentType: 'application/json',
      },
    ],  
    tags: {
      'form-name': 'kontakt',
    },
  });
 if (error.message.includes('Błąd')) {
    displayNotification('Wystąpił błąd. Proszę spróbować ponownie.', 'error');
  } else {
    displayNotification('Wystąpił nieoczekiwany błąd. Proszę skontaktować się z administratorem.', 'error');
  }
}
