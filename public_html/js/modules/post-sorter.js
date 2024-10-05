"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
/**
 * Sorts a collection of post articles based on their titles or dates.
 *
 * @param {string} type - The type of sorting (date-asc, date-desc, title-asc, title-desc).
 * @param {jQuery} postsContainer - The container element for the posts.
 */
function sortPosts(type, postsContainer) {
  var posts = $('.post-article').get();
  posts.sort(function (a, b) {
    // Sorts array elements.
    var titleA = $(a).find('h2').text().toUpperCase();
    var titleB = $(b).find('h2').text().toUpperCase();
    var dateA = new Date($(a).find('.post-date').text().trim());
    var dateB = new Date($(b).find('.post-date').text().trim());
    switch (type) {
      case 'date-asc':
        return dateA - dateB;
      case 'date-desc':
        return dateB - dateA;
      case 'title-asc':
        return titleA > titleB ? 1 : -1;
      case ' title-desc':
        return titleA < titleB ? 1 : -1;
      default:
        return 0;
    }
  });

  // Append the sorted posts to the container
  postsContainer.empty().append(posts);
}
var _default = exports["default"] = sortPosts;
//# sourceMappingURL=post-sorter.js.map
