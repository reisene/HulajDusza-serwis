"use strict";

var _postPaths = _interopRequireDefault(require("./modules/post-paths.js"));
var _postLoader = _interopRequireDefault(require("./modules/post-loader.js"));
var _postSorter = _interopRequireDefault(require("./modules/post-sorter.js"));
var _postSearcher = _interopRequireDefault(require("./modules/post-searcher.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
$(document).ready(function () {
  const postsContainer = $('#posts-container');
  try {
    (0, _postLoader.default)(_postPaths.default, postsContainer).then(postElements => {
      // Handle post sorting
      $('.dropdown-item').on('click', function () {
        const sortType = $(this).data('sort');
        (0, _postSorter.default)(sortType, postsContainer);
      });

      // Handle post searching
      $('#searchInput').on('keyup', function () {
        const searchTerm = $(this).val().toLowerCase();
        (0, _postSearcher.default)(searchTerm, postsContainer);
      });
    });
  } catch (error) {
    Sentry.captureException(error);
    Sentry.captureMessage('Błąd podczas ładowania postów');
  }
});