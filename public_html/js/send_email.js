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

    // Prepare data for Formspree submission
    var formspreeData = new FormData();
    formspreeData.append('id', uniqueID);
    formspreeData.append('name', name);
    formspreeData.append('email', email);
    formspreeData.append('phone', phone);
    formspreeData.append('message', message);
    formspreeData.append('g-recaptcha-response', token);

    // Formspree URL
    var formspreeUrl = "https://formspree.io/f/manwqoep";

    // Send data to Formspree
    fetch(formspreeUrl, {
        method: 'POST',
        body: formspreeData,
        mode: 'no-cors'
    }).then(response => {
        if (response.ok || response.type === 'opaque') {
            notification.classList.add('success', 'show');
            notificationMessage.innerHTML = "Dziękujemy za przesłanie!";
            form.reset();
        } else {
            response.json().then(data => {
                notification.classList.add('error', 'show');
                if (Object.hasOwn(data, 'errors')) {
                    notificationMessage.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    notificationMessage.innerHTML = "Ups! Wystąpił problem z przesłaniem formularza";
                }
            });
        }
        setTimeout(() => {
            notification.classList.remove('show', 'success', 'error');
        }, 5000); // Hide the notification after 5 seconds
    }).catch(error => {
        notification.classList.add('error', 'show');
        notificationMessage.innerHTML = "Ups! Wystąpił problem z przesłaniem formularza";
        setTimeout(() => {
            notification.classList.remove('show', 'success', 'error');
        }, 5000); // Hide the notification after 5 seconds
    });

    // Airtable API settings
    var airtablePersonalAccessToken = "patmmJVUgqZQmCvW3.b591c3a621807ac2d784c5c8afbff6612af7c0d2624e6131df6c0e3946dea5af"; // Your Airtable Personal Access Token
    var airtableBaseId = "appx76Q9YSMyuLxYF"; // Your Airtable Base ID
    var airtableTableName = "Submissions"; // Your Airtable table name
    var airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${airtableTableName}`;

    // Prepare data for Airtable submission
    var airtableData = {
        fields: {
            id: uniqueID,
            name: name,
            email: email,
            phone: phone,
            message: message
        }
    };

    console.log("Airtable Data: ", JSON.stringify(airtableData));

    // Send data to Airtable
    fetch(airtableUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${airtablePersonalAccessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(airtableData)
    }).then(response => {
        if (response.ok) {
            console.log("Successfully submitted to Airtable");
        } else {
            response.json().then(data => {
                console.error("Error submitting to Airtable:", data);
                notification.classList.add('error', 'show');
                notificationMessage.innerHTML = "Ups! Wystąpił problem z przesłaniem formularza: " + data.error.message;
            });
        }
        setTimeout(() => {
            notification.classList.remove('show', 'success', 'error');
        }, 5000); // Hide the notification after 5 seconds
    }).catch(error => {
        console.error("Error submitting to Airtable:", error);
        notification.classList.add('error', 'show');
        notificationMessage.innerHTML = "Ups! Wystąpił problem z przesłaniem formularza";
        setTimeout(() => {
            notification.classList.remove('show', 'success', 'error');
        }, 5000); // Hide the notification after 5 seconds
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
