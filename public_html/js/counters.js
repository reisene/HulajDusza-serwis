/**
 * Initializes and animates counters when they become visible in the viewport.
 * The counters are identified by the 'counter' class and are animated using the 'initCounters' function.
 * The function also handles scroll events to trigger the counter animations.
 */
$(document).ready(function () {
 
    $('.timer').counterUp({
        delay: 10,
        time: 1000
    });

    /**
     * Initializes each counter element found with the 'timer' class.
     * The count-up animation is achieved by incrementing the counter value at regular intervals.
     */
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

    /**
     * Handles the visibility of counter elements and initializes them if they are in view.
     * The function checks each counter element with the 'counter' class and initializes it if it is not already initialized and is in view.
     */
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

    /**
     * Handles scroll events by triggering the 'handleCounters' function.
     */
    const handleScroll = () => {
        handleCounters();
    };

    $(window).scroll(handleScroll);
    handleScroll(); // Initialize scroll animations and counters on load
});

/**
 * Checks if an element is visible in the viewport.
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} - True if the element is in view, false otherwise.
 */
function isElementInView(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}