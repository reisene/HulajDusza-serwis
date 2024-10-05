import postPaths from './modules/post-paths.js'
import loadPosts from './modules/post-loader.js'
import sortPosts from './modules/post-sorter.js'
import searchPosts from './modules/post-searcher.js'

$(document).ready(function () {
  const postsContainer = $('#posts-container')

  try {
    loadPosts(postPaths, postsContainer).then((postElements) => {
      // Handle post sorting
      $('.dropdown-item').on('click', function () {
        const sortType = $(this).data('sort')
        sortPosts(sortType, postsContainer)
      })

      // Handle post searching
      $('#searchInput').on('keyup', function () {
        const searchTerm = $(this).val().toLowerCase()
        searchPosts(searchTerm, postsContainer)
      })
    })
  } catch (error) {
    Sentry.captureException(error)
    Sentry.captureMessage('Błąd podczas ładowania postów')
  }
})
