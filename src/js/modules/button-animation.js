// Stałe dla często używanych wartości, co zmniejsza ryzyko literówek
const STATES = {
    SUBMIT: 'submit',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
};

const ICONS = {
    PAPER_PLANE: '.fa-paper-plane',
    SPINNER: '.fa-spinner',
    CHECK: '.fa-check',
    TIMES: '.fa-times'
};

/**
 * Pokazuje wybraną ikonę w przycisku
 */
function showIcon(button, iconSelector) {
    const icon = button.querySelector(iconSelector);
    if (icon) icon.classList.remove('hidden');
}

/**
 * Ukrywa wybraną ikonę w przycisku
 */
function hideIcon(button, iconSelector) {
    const icon = button.querySelector(iconSelector);
    if (icon) icon.classList.add('hidden');
}

/**
 * Resetuje animację przycisku przez wymuszenie reflow
 */
function resetButtonAnimation(button) {
    button.style.animation = 'none';
    button.offsetHeight; // Wymuszenie reflow
    button.style.animation = '';
}

/**
 * Obsługuje stan ładowania przycisku
 */
function handleLoadingState(button) {
    button.classList.remove(STATES.SUBMIT);
    button.classList.add(STATES.LOADING);
    hideIcon(button, ICONS.PAPER_PLANE);
    showIcon(button, ICONS.SPINNER);
}

/**
 * Obsługuje stan sukcesu lub błędu
 */
function handleStatusState(button, type) {
    if (type !== STATES.SUCCESS && type !== STATES.ERROR) return;
    
    button.classList.add(type);
    resetButtonAnimation(button);
    hideIcon(button, ICONS.SPINNER);
    
    const iconToShow = type === STATES.SUCCESS ? ICONS.CHECK : ICONS.TIMES;
    showIcon(button, iconToShow);
}

/**
 * Resetuje wszystkie ikony w przycisku
 */
function resetIcons(button) {
    Object.values(ICONS).forEach(icon => hideIcon(button, icon));
    const paperPlane = button.querySelector(ICONS.PAPER_PLANE);
    if (paperPlane) {
        paperPlane.setAttribute('class', 'svg-inline--fa fa-paper-plane');
    }
}

/**
 * Zgłasza błąd do Sentry gdy przycisk nie istnieje
 */
function reportButtonError() {
    Sentry.captureException(new Error('formButton is null'), {
        extra: {
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            formName: 'kontakt',
            formAction: window.location.href,
            formMethod: 'POST',
        },
    });
}

/**
 * Inicjalizuje animacje dla przycisku formularza
 */
function initButtonAnimation() {
    const formButton = document.getElementById('my-form-button');
    if (!formButton) {
        reportButtonError();
        return { animateButton: () => {}, resetButton: () => {} };
    }

    // Nasłuchiwanie zdarzeń
    formButton.addEventListener('click', () => handleLoadingState(formButton));
    formButton.addEventListener('transitionend', () => {
        if (formButton.classList.contains(STATES.LOADING)) {
            formButton.classList.remove(STATES.LOADING);
        }
    });

    return {
        animateButton: (type) => handleStatusState(formButton, type),
        resetButton: () => {
            formButton.classList.remove(STATES.LOADING, STATES.SUCCESS, STATES.ERROR);
            formButton.classList.add(STATES.SUBMIT);
            resetIcons(formButton);
        }
    };
}

export default initButtonAnimation;