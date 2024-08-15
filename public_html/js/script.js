$(document).ready(function () {
    // Inicjalizacja AOS
    AOS.init({
        duration: 1200,
    });

    // Menu toggle script
    $('.menu-icon').click(function () {
        $('nav.menu ul').addClass('active');
        $('.menu-icon').hide();
        $('.close-icon').show();
    });

    $('.close-icon').click(function () {
        $('nav.menu ul').removeClass('active');
        $('.close-icon').hide();
        $('.menu-icon').show();
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

    // Zamknięcie menu po kliknięciu poza menu
    $(document).click(function (event) {
        const menu = $('nav.menu ul');
        const menuIcon = $('.menu-icon');
        const closeIcon = $('.close-icon');

        if (!menu.is(event.target) && menu.has(event.target).length === 0 && !menuIcon.is(event.target) && menuIcon.has(event.target).length === 0 && !closeIcon.is(event.target) && closeIcon.has(event.target).length === 0) {
            menu.removeClass('active');
            closeIcon.hide();
            if ($(window).width() <= 768) { // Only show the menu icon on mobile view
                menuIcon.show();
            }
        }
    });

    // Hide or show menu icons based on window resize
    $(window).resize(function () {
        const menuIcon = $('.menu-icon');
        const closeIcon = $('.close-icon');
        if ($(window).width() > 768) {
            menuIcon.hide();
            closeIcon.hide();
        } else if (!$('nav.menu ul').hasClass('active')) {
            menuIcon.show();
        }
    });

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