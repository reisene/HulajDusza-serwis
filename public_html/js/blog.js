document.addEventListener("DOMContentLoaded", function() {
    const postsContainer = document.getElementById('posts-container');
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

                const title = doc.querySelector('h2').outerHTML;
                const date = doc.querySelector('.post-date').outerHTML;
                const image = doc.querySelector('img').outerHTML;
                const excerpt = doc.querySelector('section p').outerHTML;

                const postElement = document.createElement('div');
                postElement.innerHTML = `${title}${date}${image}${excerpt} <button class="read-more">Czytaj więcej <i class="bi bi-file-earmark-post"></i></button>`;
                
                postElement.querySelector('.read-more').addEventListener('click', function(e) {
                    e.preventDefault();
                    postsContainer.innerHTML = doc.body.innerHTML; // Załadowanie całego posta
                    postsContainer.innerHTML += '<button class="back-to-blog">Powrót do bloga <i class="fa-solid fa-arrow-rotate-left"></i></button>';
                    document.querySelector('.back-to-blog').addEventListener('click', function() {
                        location.reload(); // Powrót do strony bloga (odświeżenie)
                    });
                });

                postsContainer.appendChild(postElement);
            })
            .catch(error => console.error('Error loading post:', error));
    });
});