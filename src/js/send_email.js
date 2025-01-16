/**
 * Handles form submission, validates input, and sends data to the server using AJAX.
 *
 * @param {Event} event - The submit event triggered by the form.
 * @param {string} token - The reCAPTCHA token obtained after user interaction.
 * @returns {void}
 */
import displayNotification from './modules/notification.js';
import phoneFormatter from './modules/phone-format.js';
import initButtonAnimation from './modules/button-animation.js';

const form = document.getElementById("my-form");

const init = initButtonAnimation();


/**
 * Generates a CSRF token and stores it in local storage.
 *
 * This function fetches a CSRF token from the server, saves it in the local storage,
 * and populates a hidden input field in the form with the token. In case of an error
 * during the fetch operation, it logs the error and captures it using Sentry.
 *
 * @function generateCsfrToken
 * @returns {void} This function does not return a value.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
function generateCsfrToken() {
  // Pobierz token z serwera
  return fetch('/php/generate-token.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(csrfToken => {
      // Zapisz token w lokalnym storage
      localStorage.setItem('csrf_token', csrfToken);
      // Dodaj token do formularza
      document.getElementById('csrf-token').value = csrfToken;
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
    });
}

/**
 * Verifies the CSRF token by comparing tokens stored in local storage and the form.
 * 
 * This function invokes `generateCsfrToken` to ensure a valid CSRF token is fetched
 * and stored in local storage. It then compares the stored token with the token 
 * present in the form's hidden input field. If the tokens do not match, it recursively 
 * calls itself to retry the token verification process.
 * 
 * @function checkCsrfToken
 * @returns {Promise<void>} A promise that resolves once the token verification is complete.
 * @throws {Error} If the token generation or storage process fails.
 */
function checkCsrfToken() {
  return generateCsfrToken().then(() => { // Czekaj na zakończenie generateCsfrToken
      const storedToken = localStorage.getItem('csrf_token');
      const formToken = document.getElementById('csrf-token').value;

      if (storedToken !== formToken) {
          // Tokeny są różne, wywołaj funkcję ponownie
          return checkCsrfToken();
      }
  });
}

/**
 * Initializes event listeners for the DOMContentLoaded event and calls necessary functions.
 *
 * This function attaches an event listener to the DOMContentLoaded event, which triggers when
 * the initial HTML document has been completely loaded and parsed, without waiting for stylesheets,
 * images, and subframes to finish loading. It retrieves the phone input element, adds an input
 * event listener to it, calls the generateCsfrToken function, and finally calls the phoneFormatter
 * function.
 *
 * @returns {void} This function does not return a value.
 */
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  phoneInput.addEventListener('input', phoneFormatter);
  checkCsrfToken();
  phoneFormatter();
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
    Sentry.captureException(error, {
      extra: {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        formName: 'kontakt',
        formAction: window.location.href,
        formMethod: 'POST',
      },
    });
    return;
  }
  
  // Get form data
  const formData = getFormData();

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
      submitButton.disabled = true;
  } else {
    console.error("Submit button not found.");
    return; // Zatrzymaj dalsze przetwarzanie, jeśli przycisk nie został znaleziony
  }

  try {
    await validateFormData(submitButton, formData);
  } catch (error) {
    console.error(error);
    return;
  }

  const data = prepareData(formData, token);

  const file = new File([JSON.stringify(formData)], 'form_data.txt', {
    type: 'text/plain',
  });

  await sendDataToServer(submitButton, data, file);
}

function getFormData() {
  return {
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value.replace(/\D/g, ''),
      name: document.getElementById("name").value,
      message: document.getElementById("message").value
  };
}

/**
 * Prepares form data to be sent to the server.
 *
 * @param {Object} formData - Form data obtained from the user.
 * @param {string} token - reCAPTCHA token obtained after successful verification.
 * @returns {FormData} Prepared form data to be sent to the server.
 */
function prepareData(formData, token) {
  // Generate a unique ID for the form submission
  const uniqueID = `${Date.now()}${Math.floor(Math.random() * 1000000).toString(36)}`;

  // Get the CSRF token from the hidden input field
  const csrfToken = document.getElementById('csrf-token').value;

  // Create a new FormData object to store the form data
  const data = new FormData();

  // Append the form data to the FormData object
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('phone', formData.phone);
  data.append('message', formData.message);

  // Append the reCAPTCHA token and unique ID to the FormData object
  data.append('g-recaptcha-response', token);
  data.append('uniqueID', uniqueID);

  // Append the CSRF token to the FormData object
  data.append('csrf_token', csrfToken);

  return data;
}
function executeReCAPTCHA(event, siteKey) {
  grecaptcha.ready(() => {
    grecaptcha.execute(siteKey, { action: 'submit' })
      .then((token) => {
        if (token) {
          handleSubmit(event, token);
        } else {
          displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
        }
      })
      .catch((error) => {
        console.error("ReCAPTCHA error:", error);
        displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
      });
  });
}

// Użycie funkcji w kontekście formularza
form.addEventListener("submit", (event) => {
  event.preventDefault();
  fetch('../config.json')
    .then(response => response.text())
    .then(jsonString => {
      const config = JSON.parse(jsonString);
      executeReCAPTCHA(event, config.recaptchaSiteKey); // Wywołanie wydzielonej funkcji
    })
    .catch(error => {
      console.error('Error loading config:', error);
    });
});



/**
 * Validates form data before sending it to the server.
 *
 * @param {Object} formData - Object containing form data.
 *
 * @returns {boolean} - Returns true if form data is valid, false otherwise.
 */
async function validateFormData(submitButton, formData) {
  try {
    const response = await fetch('../php/validate-data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.error) {
      // Wyświetl błąd na stronie
      displayNotification(data.error, 'error');
      setTimeout(() => {
        init.resetButton();
      }, 200);
      throw new Error(data.error); // Rzuć wyjątek w przypadku błędu walidacji
    } else {
      // Dane formularza są prawidłowe, możesz kontynuować
      return true; // Kontynuuj proces
    }
  } catch (error) {
    submitButton.disabled = false;
    throw error; // Rzuć wyjątek w przypadku błędu
  }
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
    const response = await fetch('../php/send_email.php', {
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
        init.animateButton('success');
      }, 0);
      setTimeout(() => {
        // Calls form.reset() with a delay.
        form.reset(); // Reset the form after success
      }, 5000); // Delaying reset after success message
    } else {
      displayNotification(result.message, 'error');
      setTimeout(() => {
        // Immediately invokes itself.
        init.animateButton('error');
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
      init.resetButton();
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
        filename: 'form_data.txt',
        data: file,
        contentType: 'text/plain',
      },
    ],  
    tags: {
      'form-name': 'kontakt',
    },
    extra: {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      formData: file,
      formMethod: 'POST',
      formAction: '../php/send_email.php',
      formError: error.message,
      formErrorStack: error.stack,
      formErrorName: error.name,
      formErrorMessage: error.message,
    },
  });
 if (error.message.includes('Błąd')) {
    displayNotification('Wystąpił błąd. Proszę spróbować ponownie.', 'error');
  } else {
    displayNotification('Wystąpił nieoczekiwany błąd. Proszę skontaktować się z administratorem.', 'error');
  }
}
