document.addEventListener("DOMContentLoaded", function() {
    const postsContainer = document.getElementById('posts-container');
    const posts = [
        'post1.html',
        'post2.html',
        // Dodaj tutaj kolejne posty
    ];

    posts.forEach(post => {
        fetch(`posts/${post}`)
            .then(response => response.text())
            .then(data => {
                const postElement = document.createElement('div');
                postElement.innerHTML = data;
                postsContainer.appendChild(postElement);
            })
            .catch(error => console.error('Error loading post:', error));
    });
});