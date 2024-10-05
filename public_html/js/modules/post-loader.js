"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/**
 * Loads blog posts from HTML files and enables sorting and searching.
 *
 * @param {string[]} postPaths - An array of paths to the blog post HTML files.
 * @param {jQuery} postsContainer - The container element for the posts.
 *
 * @returns {Promise} A promise that resolves with an array of post elements.
 */
function loadPosts(postPaths, postsContainer) {
  var postElements = Array(postPaths.length).fill(null);
  var loadedPosts = 0;
  postPaths.forEach(function (postPath, index) {
    fetch(postPath).then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load post: ".concat(postPath));
      }
      return response.text();
    }).then(function (data) {
      // Parse HTML data, extract post details, and create a post element.
      var parser = new DOMParser();
      var doc = parser.parseFromString(data, 'text/html');

      // Extract post details from the HTML
      var title = $(doc).find('h2').prop('outerHTML') || '<h2>Brak tytułu</h2>';
      var date = $(doc).find('.post-date').prop('outerHTML') || '<p class="post-date"><strong>Data publikacji:</strong> Nieznana</p>';
      var image = $(doc).find('img').prop('outerHTML') || '<p>Brak obrazka</p>';
      var excerpt = $(doc).find('section p').first().prop('outerHTML') || '<p>Brak treści</p>';

      // Create a post element
      var postElement = $('<article class="post-article">').html("".concat(title).concat(date).concat(image, "<div class=\"post-content\">").concat(excerpt, "</div><button class=\"read-more\">Czytaj wi\u0119cej <i class=\"bi bi-file-earmark-post\"></i></button>"));

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
    })["catch"](function (error) {
      // Catches and handles an error.
      console.error('Error loading post:', error);
      var errorElement = $('<article class="post-article">').html("<h2>B\u0142\u0105d</h2><p>Nie uda\u0142o si\u0119 za\u0142adowa\u0107 posta: ".concat(postPath, "</p>"));
      postElements[index] = errorElement; // Zachowujemy błąd w odpowiednim miejscu w tablicy
    })["finally"](function () {
      // Increments and checks loadedPosts counter, then appends elements when loading is
      // complete.
      loadedPosts++;
      if (loadedPosts === postPaths.length) {
        // Append the post elements in reverse order to the container
        postElements.reverse().forEach(function (element) {
          return postsContainer.append(element);
        });
      }
    });
  });
  return Promise.resolve(postElements);
}
var _default = exports["default"] = loadPosts;
//# sourceMappingURL=post-loader.js.map
