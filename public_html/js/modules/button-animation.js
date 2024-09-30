/**
 * @description Initializes animations for a form submission button. It animates the
 * button's state when clicked, submits a request, and resets to its original state
 * upon completion or error.
 *
 * @returns {any} An object containing two properties: animateButton and resetButton.
 */
function initButtonAnimation() {
    const formButton = document.getElementById('my-form-button');

    /**
     * @description Modifies a UI element's appearance to indicate loading state,
     * specifically a button and its icon. It hides a plane icon, adds a spinner icon,
     * and applies a 'loading' class to change the button's style, effectively animating
     * it into a loading state.
     */
    function animateLoading() {
        formButton.classList.remove('submit')
        formButton.classList.add('loading');
        formButton.querySelector('.fa-paper-plane').classList.add('hidden');
        formButton.querySelector('.fa-spinner').classList.remove('hidden');
    }

    /**
     * @description Animates a button based on its type, adding a CSS class to change its
     * appearance and removing hidden classes from specific icons. It handles two types:
     * 'success' and 'error', changing the visible icon accordingly.
     *
     * @param {string | 'success' | 'error'} type - Used to specify animation types.
     */
    function animateButton(type) {
        if (type === 'success' || type === 'error') {
            formButton.classList.add(type);
            if (type === 'success') {
                formButton.querySelector('.fa-check').classList.remove('hidden');
            } else {
                formButton.querySelector('.fa-times').classList.remove('hidden');
            }
            formButton.querySelector('.fa-spinner').classList.add('hidden');
        } 
    }
    
    /**
     * @description Resets a form button to its default state, removing any loading or
     * status indicators and restoring the initial appearance. It also hides associated
     * icon elements when applicable.
     */
    function resetButton() {
        if (formButton) {
            formButton.classList.remove('loading', 'success', 'error');
            formButton.classList.add('submit');
            const faCheck = formButton.querySelector('.fa-check');
            const faTimes = formButton.querySelector('.fa-times');
            if (faCheck) {
                faCheck.classList.add('hidden');
            }
            if (faTimes) {
                faTimes.classList.add('hidden');
            }
            const faPaperPlane = formButton.querySelector('.fa-paper-plane');
            faPaperPlane.setAttribute('class', 'svg-inline--fa fa-paper-plane');
        } else {
            console.error('formButton jest null');
        }
    }

    // Dodaj klasę loading po kliknięciu przycisku
    formButton.addEventListener('click', animateLoading);

    // Usuń klasę loading po zakończeniu animacji
    formButton.addEventListener('transitionend', () => {
        // Handles form button transitions when they end.
        if (formButton.classList.contains('loading')) {
            formButton.classList.remove('loading');
        }
    });

    return { animateButton, resetButton };
}

export default initButtonAnimation;