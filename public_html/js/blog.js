/**
 * Main function that initializes the blog functionality.
 * Fetches and loads blog posts, handles post sorting, searching, and reading more functionality.
 */
// 
$(document).ready(function () {
    // Loads blog posts from HTML files and enables sorting and searching.
    const postsContainer = $('#posts-container');

    // Define the paths to the blog post HTML files
    const postPaths = [
        'posts/post1.html',
        'posts/post2.html',
        'posts/post3.html',
        // Add more post paths here
    ];

    // Initialize an array to store the post elements
    const postElements = Array(postPaths.length).fill(null);

    // Counter for loaded posts// Counter for loaded posts
    let loadedPosts = 0;

    // Load blog posts
    postPaths.forEach((postPath, index) => {
        // Loads and processes HTML posts from URLs.
        fetch(postPath)
            .then(response => {
                // Handles HTTP response.
                if (!response.ok) {
                    throw new Error('Nie udało się załadować posta: ' + postPath);
                }
                return response.text();
            })
            .then(data => {
                // Parses HTML data, extracts post details, and creates a post element.
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');

                // Extract post details from the HTML
                const title = $(doc).find('h2').prop('outerHTML') || '<h2>Brak tytułu</h2>';
                const date = $(doc).find('.post-date').prop('outerHTML') || '<p class="post-date"><strong>Data publikacji:</strong> Nieznana</p>';
                const image = $(doc).find('img').prop('outerHTML') || '<p>Brak obrazka</p>';
                const excerpt = $(doc).find('section p').first().prop('outerHTML') || '<p>Brak treści</p>';

                // Create a post element
                const postElement = $('<article class="post-article">').html(`${title}${date}${image}<div class="post-content">${excerpt}</div><button class="read-more">Czytaj więcej <i class="bi bi-file-earmark-post"></i></button>`);

                // Handle the "Read More" button click event
                postElement.find('.read-more').on('click', function (e) {
                    // Listens for and handles a click event on the ".read-more" element, performing
                    // several actions when triggered.
                    e.preventDefault();
                    postsContainer.html($(doc.body).html());
                    postsContainer.append('<button class="back-to-blog">Powrót do bloga <i class="bi bi-arrow-counterclockwise"></i></button>');
                    $('.back-to-blog').on('click', function () {
                        // Triggers on click events and reloads the current page.
                        location.reload();
                    });
                });

                // Store the post element in the appropriate position in the array
                postElements[index] = postElement; 
            })
            .catch(error => {
                // Catches and handles an error.
                console.error('Error loading post:', error);
                const errorElement = $('<article class="post-article">').html(`<h2>Błąd</h2><p>Nie udało się załadować posta: ${postPath}</p>`);
                postElements[index] = errorElement; // Zachowujemy błąd w odpowiednim miejscu w tablicy
            })
            .finally(() => {
                // Increments and checks loadedPosts counter, then appends elements when loading is
                // complete.
                loadedPosts++;
                if (loadedPosts === postPaths.length) {
                    // Append the post elements in reverse order to the container
                    postElements.reverse().forEach(element => postsContainer.append(element));
                }
                
            });
    });

    // Handle post sorting
    $('.dropdown-item').on('click', function () {
        // Triggers sorting when an item is clicked.
        const sortType = $(this).data('sort');

        // Add the "active" class to the clicked element
        $('.dropdown-item').removeClass('active-sort');
        $(this).addClass('active-sort');

        // Sort the posts
        sortPosts(sortType);
    });

    /**
     * @description Sorts a collection of post articles based on their titles or dates,
     * depending on the provided type parameter. It then updates the DOM by appending the
     * sorted posts to a specified container element.
     *
     * @param {string | 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc'} type -
     * Used to specify sorting criteria.
     *
     * @returns {DOMElement[]} An array containing zero or more DOM elements representing
     * the sorted posts.
     */
    function sortPosts(type) {
        const posts = $('.post-article').get();

        posts.sort((a, b) => {
            // Sorts array elements.
            const titleA = $(a).find('h2').text().toUpperCase();
            const titleB = $(b).find('h2').text().toUpperCase();
            const dateA = new Date($(a).find('.post-date').text().trim());
            const dateB = new Date($(b).find('.post-date').text().trim());

            switch (type) {
                case 'date-asc':
                    return dateA - dateB;
                case 'date-desc':
                    return dateB - dateA;
                case 'title-asc':
                    return titleA > titleB ? 1 : -1;
                case 'title-desc':
                    return titleA < titleB ? 1 : -1;
                default:
                    return 0;
            }
        });

        // Append the sorted posts to the container
        $('#posts-container').empty().append(posts);
    }

    // Handle post searching
    $('#searchInput').on('keyup', function () {
        // Triggers search functionality.
        const searchTerm = $(this).val().toLowerCase();

        // Loop through each post element
        $('.post-article').each(function () {
            // Filters search results.
            const title = $(this).find('h2').text().toLowerCase();
            const excerpt = $(this).find('.post-content').text().toLowerCase();
            const date = $(this).find('.post-date').text().toLowerCase(); // Pobieramy tekst daty

            // Normalize the date by removing hyphens for easier comparison
            const normalizedDate = date.replace(/-/g, '');
            const normalizedSearchTerm = searchTerm.replace(/-/g, '');

            // Check if the search term matches the title, excerpt, or date
            if (title.includes(searchTerm) || excerpt.includes(searchTerm) || normalizedDate.includes(normalizedSearchTerm)) {
                $(this).show(); // Show the post element if a match is found
            } else {
                $(this).hide(); // Hide the post element if no match is found
            }
        });
    });
});