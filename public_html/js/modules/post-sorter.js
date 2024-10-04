/**
 * Sorts a collection of post articles based on their titles or dates.
 *
 * @param {string} type - The type of sorting (date-asc, date-desc, title-asc, title-desc).
 * @param {jQuery} postsContainer - The container element for the posts.
 */
function sortPosts(type, postsContainer) {
    const posts = $('.post-article').get();
  
    posts.sort((a, b) => {
      // Sorts array elements.
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