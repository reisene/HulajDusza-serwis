$(document).ready(function () {
 
    $('.timer').counterUp({
        delay: 10,
        time: 1000
    });

    const initCounters = () => {
        $('.timer').each(function () {
            console.log("Counter found:", this);
            var countTo = parseInt($(this).attr('data-to'));
            var speed = parseInt($(this).attr('data-speed'));
            var count = 0;
            var increment = countTo / (speed / 100); // increment per step

            var $this = $(this);
            var counter = setInterval(function () {
                count += increment;
                if (count >= countTo) {
                    count = countTo;
                    clearInterval(counter);
                }
                $this.text(Math.floor(count));
            }, 100);
        });
    };

    const countersInitialized = new Set();

    const handleCounters = () => {
        $('.counter').each(function () {
            console.log("Checking counter visibility:", this);
            if (isElementInView(this) && !countersInitialized.has(this)) {
                console.log("Counter in view:", this);
                initCounters();
                countersInitialized.add(this);
            }
        });
    };

    const handleScroll = () => {
        handleCounters();
    };

    $(window).scroll(handleScroll);
    handleScroll(); // Initialize scroll animations and counters on load
});

function isElementInView(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
