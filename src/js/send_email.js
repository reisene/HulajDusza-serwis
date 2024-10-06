import displayNotification from './modules/notification.js';
import phoneFormatter from './modules/phone_format.js';
import initButtonAnimation from './modules/button-animation.js';

phoneFormatter();

const { animateButton, resetButton } = initButtonAnimation();

const form = document.getElementById("my-form");

function validateFormData(formData) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mobilePhonePattern = /^[0-9]{9}$/;

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

function prepareFormData() {
  const formData = {
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value.replace(/\D/g, ''), // Usuń wszystkie niecyfrowe znaki z numeru telefonu,
    name: document.getElementById("name").value,
    message: document.getElementById("message").value
  };

  return formData;
}

function prepareDataForSending(formData, token) {
  const data = new FormData();
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('phone', formData.phone);
  data.append('message', formData.message);
  data.append('g-recaptcha-response', token);
  data.append('uniqueID', `${Date.now()}${Math.floor(Math.random() * 1000000).toString(36)}`);

  return data;
}

function sendFormData(data) {
  fetch('/php/send_email.php', {
    method: 'POST',
    body: data,
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      displayNotification(result.message, 'success');
      animateButton('success');
      setTimeout(() => {
        form.reset();
      }, 5000);
    } else {
      displayNotification(result.message, 'error');
      animateButton('error');
    }
  })
  .catch(error => {
    console.error("Form submission error:", error.message, error.stack);
    displayNotification("Ups! Wystąpił problem z przesłaniem formularza", 'error');
  })
  .finally(() => {
    resetButton();
  });
}

function handleButtonState(submitButton) {
  submitButton.disabled = true;
  setTimeout(() => {
    resetButton();
  }, 5000);
}

function handleReCAPTCHA(token) {
  if (token) {
    handleSubmit(token);
  } else {
    displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
  }
}

form.addEventListener("submit", function(event) {
  event.preventDefault();
  grecaptcha.ready(function() {
    grecaptcha.execute('6LeTFCAqAAAAAKlvDJZjZnVCdtD76hc3YZiIUs_Q', {action: 'submit'})
    .then(function(token) {
      handleReCAPTCHA(token);
    })
    .catch(function(error) {
      console.error("ReCAPTCHA error:", error);
      displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
    });
  });
})

async function handleSubmit(token) {
  const formData = prepareFormData();

  if (!validateFormData(formData)) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) {
    handleButtonState(submitButton);
  }

  const data = prepareDataForSending(formData, token);
  sendFormData(data);
}