/**
 * Handles form submission, validates input, and sends data to the server using AJAX.
 *
 * @param {Event} event - The submit event triggered by the form.
 * @param {string} token - The reCAPTCHA token obtained after user interaction.
 * @returns {void}
 */
var form = document.getElementById("my-form");

async function handleSubmit(event, token) {
    event.preventDefault();
    var notification = document.getElementById("notification");
    var notificationMessage = document.getElementById("notification-message");
    var status = document.getElementById("my-form-status");
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value.replace(/\D/g, ''); // Remove non-digit characters for validation
    var name = document.getElementById("name").value;
    var message = document.getElementById("message").value;

    // Email and phone validation patterns
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var mobilePhonePattern = /^[0-9]{9}$/; // Polish mobile phone number pattern: 9 digits

    // Check if at least one of email or phone is filled
    if (!email && !phone) {
        notification.classList.add('error', 'show');
        notificationMessage.innerHTML = "Proszę podać adres email lub numer telefonu.";
        setTimeout(() => {
            notification.classList.remove('show', 'success', 'error');
        }, 5000); // Hide the notification after 5 seconds
        return;
    }

    // Validate email format
    if (email && !emailPattern.test(email)) {
        notification.classList.add('error', 'show');
        notificationMessage.innerHTML = "Proszę podać prawidłowy adres email.";
        setTimeout(() => {
            notification.classList.remove('show', 'success', 'error');
        }, 5000); // Hide the notification after 5 seconds
        return;
    }

    // Validate phone format
    if (phone && !mobilePhonePattern.test(phone)) {
        notification.classList.add('error', 'show');
        notificationMessage.innerHTML = "Proszę podać prawidłowy numer telefonu (9 cyfr).";
        setTimeout(() => {
            notification.classList.remove('show', 'success', 'error');
        }, 5000); // Hide the notification after 5 seconds
        return;
    }

    // Generate a unique ID for the submission
    var uniqueID = new Date().getTime() + "-" + Math.floor(Math.random() * 1000000);

    // Prepare data for sending
    var formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('message', message);
    formData.append('g-recaptcha-response', token);
    formData.append('uniqueID', uniqueID);

    // Send data to PHP
    fetch('/php/send_email.php', {
        method: 'POST',
        body: formData,
    }).then(response => response.json()).then(data => {
        if (data.success) {
            displayNotification(data.message, 'success');
            form.reset();
        } else {
            displayNotification(data.message, 'error');
        }
    }).catch(error => {
        displayNotification("Ups! Wystąpił problem z przesłaniem formularza", 'error');
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    grecaptcha.ready(function() {
        grecaptcha.execute('6LeTFCAqAAAAAKlvDJZjZnVCdtD76hc3YZiIUs_Q', {action: 'submit'}).then(function(token) {
            handleSubmit(event, token);
        });
    });
});

/**
 * Displays a notification with a given message and type.
 *
 * @param {string} message - The message to display in the notification.
 * @param {string} type - The type of notification (e.g., 'success', 'error').
 * @returns {void}
 */
function displayNotification(message, type) {
    var notification = document.getElementById("notification");
    var notificationMessage = document.getElementById("notification-message");
    notification.classList.add(type, 'show');
    notificationMessage.innerHTML = message;
    setTimeout(() => {
        notification.classList.remove('show', 'success', 'error');
    }, 5000);
}