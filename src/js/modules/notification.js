/**
 * Displays a notification to the user with a specified message and type.
 * The notification is added to the webpage and screen readers are notified.
 * It removes the notification after 5 seconds, allowing for customizable notifications.
 *
 * @param {string} message - The content of the notification to be displayed.
 * @param {string | 'success' | 'error'} type - The type of notification, used to indicate the color scheme.
 *
 * @returns {void}
 */
function displayNotification(message, type) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");

    // Make sure notification exists before attempting to modify it
    if (!notification || !notificationMessage) {
        console.error("Elementy notification lub notificationMessage nie istnieją");
        Sentry.captureException(new Error("Elementy notification lub notificationMessage nie istnieją"));
        return;
    }

    notification.classList.add(type, 'show');
    notificationMessage.textContent = message;

    // Notify screen readers
    notification.setAttribute('aria-live', 'assertive');

    if (type === 'error') {
        Sentry.captureException(new Error(message));
    }

    setTimeout(() => {
        // Waits then removes classes.
        notification.classList.remove('show', 'success', 'error');
    }, 5000);
};

export default displayNotification;