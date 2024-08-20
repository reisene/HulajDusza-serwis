$(document).ready(function() {
    const postsContainer = $('#posts-container');
    const postPaths = [
        'posts/post1.html',
        'posts/post2.html',
        'posts/post3.html',
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
                const excerpt = $(doc).find('section p').first().prop('outerHTML');

                // Tworzymy pojedynczy post z odpowiednimi klasami
                const postElement = $('<article class="post-article">').html(`${title}${date}${image}<div class="post-content">${excerpt}</div><button class="read-more">Czytaj więcej <i class="bi bi-file-earmark-post"></i></button>`);

                // Dodajemy funkcjonalność przycisku "Czytaj więcej"
                postElement.find('.read-more').on('click', function(e) {
                    e.preventDefault();
                    postsContainer.html($(doc.body).html()); // Załadowanie pełnego posta
                    postsContainer.append('<button class="back-to-blog">Powrót do bloga <i class="bi bi-arrow-counterclockwise"></i></button>');
                    $('.back-to-blog').on('click', function() {
                        location.reload(); // Powrót do strony bloga
                    });
                });

                postsContainer.append(postElement);
            })
            .catch(error => console.error('Error loading post:', error));
    });
});
