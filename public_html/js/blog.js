$(document).ready(function() {
    const postsContainer = $('#posts-container');
    const postPaths = [
        'posts/post1.html',
        'posts/post3.html',
        'posts/post2.html',
        // Inne posty
    ];

    const postElements = Array(postPaths.length).fill(null); // Tablica do przechowywania elementów

    let loadedPosts = 0;

    postPaths.forEach((postPath, index) => {
        fetch(postPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nie udało się załadować posta: ' + postPath);
                }
                return response.text();
            })
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');

                const title = $(doc).find('h2').prop('outerHTML') || '<h2>Brak tytułu</h2>';
                const date = $(doc).find('.post-date').prop('outerHTML') || '<p class="post-date"><strong>Data publikacji:</strong> Nieznana</p>';
                const image = $(doc).find('img').prop('outerHTML') || '<p>Brak obrazka</p>';
                const excerpt = $(doc).find('section p').first().prop('outerHTML') || '<p>Brak treści</p>';

                const postElement = $('<article class="post-article">').html(`${title}${date}${image}<div class="post-content">${excerpt}</div><button class="read-more">Czytaj więcej <i class="bi bi-file-earmark-post"></i></button>`);

                postElement.find('.read-more').on('click', function(e) {
                    e.preventDefault();
                    postsContainer.html($(doc.body).html()); 
                    postsContainer.append('<button class="back-to-blog">Powrót do bloga <i class="bi bi-arrow-counterclockwise"></i></button>');
                    $('.back-to-blog').on('click', function() {
                        location.reload(); 
                    });
                });

                postElements[index] = postElement; // Zachowujemy element w odpowiednim miejscu w tablicy
            })
            .catch(error => {
                console.error('Error loading post:', error);
                const errorElement = $('<article class="post-article">').html(`<h2>Błąd</h2><p>Nie udało się załadować posta: ${postPath}</p>`);
                postElements[index] = errorElement; // Zachowujemy błąd w odpowiednim miejscu w tablicy
            })
            .finally(() => {
                loadedPosts++;
                if (loadedPosts === postPaths.length) {
                    postElements.reverse().forEach(element => postsContainer.append(element)); // Wyświetlamy elementy w odpowiedniej kolejności
                }
            });
    });
});