/**
 * @description Hides all post articles and then iterates over them, showing each
 * post that contains the search term in its title or excerpt.
 *
 * @param {string} searchTerm - Used to filter posts based on the entered search term.
 *
 * @param {object} postsContainer - Unused in the provided code snippet.
 */
function searchPosts(searchTerm, postsContainer) {
    const posts = $('.post-article');
  
    posts.each(function () {
      // Hides or shows a post element based on search term.
      const post = $(this);
      const title = post.find('h2').text().toLowerCase();
      const excerpt = post.find('.post-content').text().toLowerCase();
  
      if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
        post.show();
      } else {
        post.hide();
      }
    });
  }
  
  export default searchPosts;