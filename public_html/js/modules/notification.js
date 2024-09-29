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
            // Removes classes from an HTML element.
            notification.classList.remove('show', 'success', 'error');
        }, 5000);
    }
};

export default displayNotification;
