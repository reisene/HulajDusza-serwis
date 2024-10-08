/**
 * Searches for posts based on a search term.
 *
 * @param {string} searchTerm - The search term to look for.
 * @param {jQuery} postsContainer - The container element for the posts.
 */
function searchPosts(searchTerm, postsContainer) {
  const posts = $(".post-article");

  posts.each(function () {
    const post = $(this);
    const title = post.find("h2").text().toLowerCase();
    const excerpt = post.find(".post-content").text().toLowerCase();

    if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
      post.show();
    } else {
      post.hide();
    }
  });
}

export default searchPosts;
