document.addEventListener('DOMContentLoaded', function() {
    var a2a_config = a2a_config || {};
    a2a_config.templates = a2a_config.templates || {};
    a2a_config.onclick = false;
    a2a_config.locale = "pl";
    a2a_config.thanks = {
        postShare: true,
        ad: true,
    };

    var shareButtons = document.getElementById('share-buttons');
    var toggleButton = document.getElementById('toggle-share-buttons');

    // Funkcja do przełączania widoczności panelu
    function toggleShareButtons() {
        if (shareButtons.style.display === 'none' || shareButtons.style.display === '') {
            // Oblicz dynamicznie pozycję panelu tylko przy wyświetlaniu
            var buttonRect = toggleButton.getBoundingClientRect();
            shareButtons.style.left = (buttonRect.right + 0) + 'px';
            shareButtons.style.display = 'block';
        } else {
            shareButtons.style.display = 'none';
        }
    }

    // Dodajemy obsługę kliknięcia na przycisk
    toggleButton.addEventListener('click', toggleShareButtons); 

    // Dodajemy obsługę kliknięcia poza panelem, aby go ukryć
    document.addEventListener('click', function (event) {
        var isClickInsidePanel = shareButtons.contains(event.target);
        var isClickOnToggleButton = toggleButton.contains(event.target);

        if (!isClickInsidePanel && ! isClickOnToggleButton) {
            shareButtons.style.display = 'none';
        }
    });
    if ('ontouchstart' in window || navigator.maxTouchPoints) { // Sprawdza, czy urządzenie ma możliwość dotyku (czyli prawdopodobnie mobilne)
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { // Sprawdza, czy to urządzenie mobilne
            document.querySelector('.a2a_button_sms').style.display = 'block';
        }
    } else {
        document.querySelector('.a2a_button_sms').style.display = 'none';
    };
});
