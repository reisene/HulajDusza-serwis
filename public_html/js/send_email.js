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

    // Check if form exists before continuing
    if (!form) {
        console.error("Form not found.");
        return;
    }

    var notification = document.getElementById("notification");
    var notificationMessage = document.getElementById("notification-message");
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value.replace(/\D/g, ''); // Remove non-digit characters for validation
    var name = document.getElementById("name").value;
    var message = document.getElementById("message").value;

    // Email and phone validation patterns
    var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    var mobilePhonePattern = /^[0-9]{9}$/; // Polish mobile phone number pattern: 9 digits

    // Check if at least one of email or phone is filled
    if (!email && !phone) {
        displayNotification("Proszę podać adres email lub numer telefonu.", 'error');
        return;
    }

    // Validate email format
    if (email && !emailPattern.test(email)) {
        displayNotification("Proszę podać prawidłowy adres email.", 'error');
        return;
    }

    // Validate phone format
    if (phone && !mobilePhonePattern.test(phone)) {
        displayNotification("Proszę podać prawidłowy numer telefonu (9 cyfr).", 'error');
        return;
    }

    // Disable form submission button to prevent duplicate submissions
    var submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
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
    try {
        let response = await fetch('/php/send_email.php', {
            method: 'POST',
            body: formData,
        });

        let data = await response.json();

        if (data.success) {
            displayNotification(data.message, 'success');
            setTimeout(() => {
                form.reset(); // Reset the form after success
            }, 5000); // Delaying reset after success message
        } else {
            displayNotification(data.message, 'error');
        }

    } catch (error) {
        console.error("Form submission error:", error);
        displayNotification("Ups! Wystąpił problem z przesłaniem formularza", 'error');
    } finally {
        // Re-enable the submit button
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    grecaptcha.ready(function() {
        grecaptcha.execute('6LeTFCAqAAAAAKlvDJZjZnVCdtD76hc3YZiIUs_Q', {action: 'submit'})
        .then(function(token) {
            if (token) {
                handleSubmit(event, token);
            } else {
                displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
            }
        })
        .catch(function(error) {
            console.error("ReCAPTCHA error:", error);
            displayNotification("ReCAPTCHA verification failed. Please try again.", 'error');
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

    // Make sure notification exists before attempting to modify it
    if (notification && notificationMessage) {
        notification.classList.add(type, 'show');
        notificationMessage.innerHTML = message;

        // Notify screen readers
        notification.setAttribute('aria-live', 'assertive');

        setTimeout(() => {
            notification.classList.remove('show', 'success', 'error');
        }, 5000);
    }
}
