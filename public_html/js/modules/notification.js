/**
 * @description Creates a visual notification with a specified message and type on a
 * webpage. It adds classes to display the notification, assigns an aria attribute
 * for screen readers, sets the message content, and removes the notification after
 * 5 seconds.
 *
 * @param {string} message - Used to set notification text content.
 *
 * @param {'success' | 'error' | string} type - Used to determine notification style
 * (success or error).
 */

function displayNotification(message, type) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");

    // Make sure notification exists before attempting to modify it
    if (!notification || !notificationMessage) {
        console.error("Elementy notification lub notificationMessage nie istnieją");
        return;
    }

    // Make sure notification exists before attempting to modify it
    if (notification && notificationMessage) {
        notification.classList.add(type, 'show');
        notificationMessage.textContent = message;

        // Notify screen readers
        notification.setAttribute('aria-live', 'assertive');

        setTimeout(() => {
            // Waits and removes classes.
            notification.classList.remove('show', 'success', 'error');
        }, 5000);
    }
};

export default displayNotification;
