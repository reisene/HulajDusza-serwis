"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/**
 * Searches for posts based on a search term.
 *
 * @param {string} searchTerm - The search term to look for.
 * @param {jQuery} postsContainer - The container element for the posts.
 */
function searchPosts(searchTerm, postsContainer) {
  var posts = $('.post-article');
  posts.each(function () {
    var post = $(this);
    var title = post.find('h2').text().toLowerCase();
    var excerpt = post.find('.post-content').text().toLowerCase();
    if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
      post.show();
    } else {
      post.hide();
    }
  });
}
var _default = exports["default"] = searchPosts;
//# sourceMappingURL=post-searcher.js.map
