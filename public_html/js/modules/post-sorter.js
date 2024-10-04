/**
 * @description Sorts a list of blog posts in a specified order based on their title
 * or date. It retrieves all posts with the class 'post-article', sorts them according
 * to the provided type, and then appends the sorted list to a specified container.
 *
 * @param {string | 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc'} type -
 * Used to specify the sorting criteria and order of the posts.
 *
 * @param {object} postsContainer - Used to specify the container element where the
 * sorted posts will be appended.
 *
 * @returns {any} 0.
 */
function sortPosts(type, postsContainer) {
    const posts = $('.post-article').get();
  
    posts.sort((a, b) => {
      // Sorts an array of HTML elements based on title or date.
      const titleA = $(a).find('h2').text().toUpperCase();
      const titleB = $(b).find('h2').text().toUpperCase();
      const dateA = new Date($(a).find('.post-date').text().trim());
      const dateB = new Date($(b).find('.post-date').text().trim());
  
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
  
  export default sortPosts;