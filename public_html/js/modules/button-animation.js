// button-animation.js
function initButtonAnimation() {
    const formButton = document.getElementById('my-form-button');

    // Funkcja do animacji ładowania
    function animateLoading() {
        formButton.classList.remove('submit')
        formButton.classList.add('loading');
        formButton.querySelector('.fa-paper-plane').classList.add('hidden');
        formButton.querySelector('.fa-spinner').classList.remove('hidden');
    }

    // Funkcja do animacji buttonu po otrzymaniu odpowiedzi serwera
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
    
    // Funkcja do resetowania buttonu
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
        if (formButton.classList.contains('loading')) {
            formButton.classList.remove('loading');
        }
    });

    return { animateButton, resetButton };
}

export default initButtonAnimation;