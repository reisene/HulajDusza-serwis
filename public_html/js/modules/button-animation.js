// button-animation.js
function initButtonAnimation() {
    const formButton = document.getElementById('my-form-button');

    // Funkcja do animacji ładowania
    function animateLoading() {
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
            formButton.classList.remove('loading', 'success', 'error');
            formButton.querySelector('.fa-check').classList.add('hidden');
            formButton.querySelector('.fa-times').classList.add('hidden');
            formButton.querySelector('.fa-paper-plane').classList.remove('hidden');
        
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