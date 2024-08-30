$(document).ready(function () {
    // Inicjalizacja AOS
    AOS.init({
        duration: 1200,
    });

    const menu = $('nav.menu ul');
    const menuToggle = $('.menu-toggle');
    const menuIcon = $('.menu-icon');
    const closeIcon = $('.close-icon');

    // Przełączanie menu
    menuToggle.click(function () {
        if (!menu.hasClass('active')) {
            menu.addClass('active').css('animation', 'menu-opacityup 0.2s ease-in-out forwards');
        } else {
            menu.css('animation', 'menu-opacitydown 0.2s ease-in-out forwards');
            setTimeout(function () {
                menu.removeClass('active');
            }, 200); // Dopasuj do czasu trwania animacji
        }
        menuIcon.toggle();
        closeIcon.toggle();
    });

    // Zamknięcie menu po kliknięciu poza nim
    $(document).click(function (event) {
        if (!menu.is(event.target) && menu.has(event.target).length === 0 &&
            !menuToggle.is(event.target) && menuToggle.has(event.target).length === 0 && menu.hasClass('active')) {
            menu.css('animation', 'menu-opacitydown 0.2s ease-in-out forwards');
            setTimeout(function () {
                menu.removeClass('active');
                closeIcon.hide();
                if ($(window).width() <= 768) {
                    menuIcon.show();
                }
            }, 200); // Dopasuj do czasu trwania animacji
        }
    });

    // Dostosowanie ikon menu przy zmianie rozmiaru okna
    $(window).resize(function () {
        if ($(window).width() > 768) {
            menuIcon.hide();
            closeIcon.hide();
        } else if (!menu.hasClass('active')) {
            menuIcon.show();
        }
    });

    // Add 'active' class to the current menu item
    var currentUrl = window.location.href;
    var baseUrl = window.location.origin; // Get the base URL, e.g., "http://127.0.0.1:5500" or "http://moja-domena.pl"

    $('nav.menu ul li a').each(function () {
        var linkUrl = this.href;
        
        // Check if the link is to the homepage
        if (linkUrl === currentUrl || 
            (linkUrl === baseUrl + '/' && currentUrl === baseUrl + '/') || 
            (linkUrl === baseUrl + '/index.html' && (currentUrl === baseUrl + '/' || currentUrl === baseUrl + '/index.html'))) {
            $(this).parent().addClass('active');
        }
    });

    // Smooth scroll functionality for navigation links
    $('.smooth-scroll').click(function (e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 800);
    });

    // Dodajemy obsługę sticky headera i menu
    const stickyHeader = $('header');
    const stickyMenu = $('nav.menu');
    const sticky = stickyHeader.offset().top;
    const logo = $('.header-left img'); // Select your logo image

    function makeSticky() {
        const scrollTop = $(window).scrollTop();
    
        // Sticky header and menu
        if (scrollTop > sticky) {
            stickyHeader.addClass('sticky');
            stickyMenu.addClass('sticky');
        } else {
            stickyHeader.removeClass('sticky');
            stickyMenu.removeClass('sticky');
        }
        
        // Logo and header scaling
        const maxLogoScale = 150; // Original width
        const minLogoScale = 100; // Reduced width in sticky state
        const maxScroll = 300; // Adjust this value to set when the scaling stops

        let logoWidth = maxLogoScale - (scrollTop / maxScroll) * (maxLogoScale - minLogoScale);
        if (logoWidth < minLogoScale) logoWidth = minLogoScale;
        logo.css('width', logoWidth + 'px');

        const maxPadding = 10; // Original padding top/bottom
        const minPadding = 5;  // Reduced padding in sticky state

        let headerPadding = maxPadding - (scrollTop / maxScroll) * (maxPadding - minPadding);
        if (headerPadding < minPadding) headerPadding = minPadding;
        stickyHeader.css('padding', headerPadding + 'px 20px');
    }    

    $(window).scroll(makeSticky);

    // Pobrano tytuł strony z elementu title
    var originalTitle = document.title;

    // Dodano część tytułu, która pojawia się na każdej stronie
    var siteName = " - HulajDusza serwis hulajnóg elektrycznych";

    // Aktualizacja tytułu strony
    document.title = originalTitle + siteName;

    // Scroll to top button functionality
    const mybutton = $("#scrollToTopBtn");

    $(window).scroll(function () {
        if ($(this).scrollTop() > 20) {
            mybutton.addClass("show");
        } else {
            mybutton.removeClass("show");
        }
    });

    mybutton.click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 'smooth');
    });

    // Scroll animations with Intersection Observer
    const scrollElements = $('.fade-in');

    const observerOptions = {
        threshold: 0.25
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    scrollElements.each(function () {
        observer.observe(this);
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/service-worker.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }, (error) => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

function isElementInView(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Tawk.to Script
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function(){
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/66ae13d81601a2195ba058ee/1i4bvr1p7';
    s1.charset = 'UTF-8'; //charset depreciated, only for compatibility
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();