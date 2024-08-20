$(document).ready(function() {
    const postsContainer = $('#posts-container');
    const postPaths = [
        'posts/post1.html',
        'posts/post2.html',
        // Inne posty
    ];

    postPaths.forEach(postPath => {
        fetch(postPath)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');

                const title = $(doc).find('h2').prop('outerHTML');
                const date = $(doc).find('.post-date').prop('outerHTML');
                const image = $(doc).find('img').prop('outerHTML');
                const excerpt = $(doc).find('section p').prop('outerHTML');

                const postElement = $('<div>').html(`${title}${date}${image}${excerpt} <button class="read-more">Czytaj więcej <i class="bi bi-file-earmark-post"></i></button>`);

                postElement.find('.read-more').on('click', function(e) {
                    e.preventDefault();
                    postsContainer.html($(doc.body).html()); // Załadowanie całego posta
                    postsContainer.append('<button class="back-to-blog">Powrót do bloga <i class="fa-solid fa-arrow-rotate-left"></i></button>');
                    $('.back-to-blog').on('click', function() {
                        location.reload(); // Powrót do strony bloga (odświeżenie)
                    });
                });

                postsContainer.append(postElement);

                // Zastosowanie stylów po dodaniu elementów
                postsContainer.find('.post-date').css({
                    'font-size': '0.7em',
                    'color': '#777'
                });
            })
            .catch(error => console.error('Error loading post:', error));
    });
});