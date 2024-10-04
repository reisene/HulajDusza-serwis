/**
 * @description Loads multiple HTML posts from given URLs, extracts post details,
 * creates HTML elements, and appends them to a container element upon completion.
 * It handles errors, supports pagination, and includes a "Read More" button with a
 * back-to-blog feature.
 *
 * @param {string[]} postPaths - An array of URLs to load HTML posts from.
 *
 * @param {object} postsContainer - Used to append loaded post elements to it.
 *
 * @returns {HTMLElement[]} An array of DOM elements representing the loaded posts.
 */
function loadPosts(postPaths, postsContainer) {
    const postElements = Array(postPaths.length).fill(null);
    let loadedPosts = 0;
  
    postPaths.forEach((postPath, index) => {
      // Loads and parses HTML posts.
      fetch(postPath)
        .then(response => {
          // Processes a response from an HTTP request.
          if (!response.ok) {
            throw new Error(`Failed to load post: ${postPath}`);
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
            // Listens for a click event on a specific element and performs several actions when
            // triggered.
            // several actions when triggered.
            e.preventDefault();
            postsContainer.html($(doc.body).html());
            postsContainer.append('<button class="back-to-blog">Powrót do bloga <i class="bi bi-arrow-counterclockwise"></i></button>');
            $('.back-to-blog').on('click', function () {
              // Triggers on a specific event and reloads the current page.
              location.reload();
            });
          });
  
          // Store the post element in the appropriate position in the array
          postElements[index] = postElement;
        })
        .catch(error => {
          // Catches and handles errors.
          console.error('Error loading post:', error);
          const errorElement = $('<article class="post-article">').html(`<h2>Błąd</h2><p>Nie udało się załadować posta: ${postPath}</p>`);
          postElements[index] = errorElement; // Zachowujemy błąd w odpowiednim miejscu w tablicy
        })
        .finally(() => {
          // Increments the loadedPosts counter and appends post elements to the container when
          // all posts are loaded.
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