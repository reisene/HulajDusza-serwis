/**
 * Loads blog posts from HTML files and enables sorting and searching.
 *
 * @param {string[]} postPaths - An array of paths to the blog post HTML files.
 * @param {jQuery} postsContainer - The container element for the posts.
 *
 * @returns {Promise} A promise that resolves with an array of post elements.
 */
function loadPosts(postPaths, postsContainer) {
    const postElements = Array(postPaths.length).fill(null);
    let loadedPosts = 0;
  
    postPaths.forEach((postPath, index) => {
      fetch(postPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load post: ${postPath}`);
          }

          return response.text();
        })
        .then(data => {
          // Parse HTML data, extract post details, and create a post element.
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, 'text/html');
  
          // Extract post details from the HTML
          const title = $(doc).find('h2').text() || 'Brak tytułu'; // Użyj .text() zamiast .outerHTML
          const date = $(doc).find('.post-date').text() || 'Data publikacji: Nieznana'; // Użyj .text()
          const imageSrc = $(doc).find('img').attr('src'); // Użyj .attr() do uzyskania src
          const image = imageSrc ? `<img src="${imageSrc}" alt="Post Image">` : '<p>Brak obrazka</p>'; // Upewnij się, że obrazek jest bezpieczny
          const excerpt = $(doc).find('section p').first().text() || 'Brak treści'; // Użyj .text()
  
          // Create a post element
          const postElement = $('<article class="post-article">')
            .append(`<h2>${title}</h2>`)
            .append(`<p class="post-date"><strong>Data publikacji:</strong> ${date}</p>`)
            .append(image)
            .append(`<div class="post-content"><p>${excerpt}</p></div>`)
            .append('<button class="read-more">Czytaj więcej <i class="bi bi-file-earmark-post"></i></button>');
  
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
  
    return Promise.resolve(postElements);
  }
  
  export default loadPosts;