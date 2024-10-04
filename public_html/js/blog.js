import postPaths from './modules/post-paths.js';
import loadPosts from './modules/post-loader.js';
import sortPosts from './modules/post-sorter.js';
import searchPosts from './modules/post-searcher.js';

$(document).ready(function () {

  // Loads and handles posts on a webpage.
  const postsContainer = $('#posts-container');

  try {
    loadPosts(postPaths, postsContainer).then(postElements => {
      // Executes after loading posts.
      $('.dropdown-item').on('click', function () {
        // Handles a dropdown item click event, retrieves the sort type from the clicked item,
        // and sorts the posts accordingly.
        const sortType = $(this).data('sort');
        sortPosts(sortType, postsContainer);
      });

      // Handle post searching
      $('#searchInput').on('keyup', function () {
        // Triggers on each keyup event of an element.
        const searchTerm = $(this).val().toLowerCase();
        searchPosts(searchTerm, postsContainer);
      });
    });
  } catch (error) {
    Sentry.captureException(error);
    Sentry.captureMessage('Błąd podczas ładowania postów');
  }
});