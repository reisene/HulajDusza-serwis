"use strict";

/**
 * Main function that initializes the blog functionality.
 * Fetches and loads blog posts, handles post sorting, searching, and reading more functionality.
 */
// 
$(document).ready(function () {
  // Loads blog posts from HTML files and enables sorting and searching.
  var postsContainer = $('#posts-container');

  // Define the paths to the blog post HTML files
  var postPaths = ['posts/post1.html', 'posts/post2.html', 'posts/post3.html'
  // Add more post paths here
  ];

  // Initialize an array to store the post elements
  var postElements = Array(postPaths.length).fill(null);

  // Counter for loaded posts// Counter for loaded posts
  var loadedPosts = 0;

  // Load blog posts
  postPaths.forEach(function (postPath, index) {
    // Loads and processes HTML posts from URLs.
    fetch(postPath).then(function (response) {
      // Handles HTTP response.
      if (!response.ok) {
        // skipcq: JS-0246
        throw new Error('Nie udało się załadować posta: ' + postPath);
      }
      return response.text();
    }).then(function (data) {
      // Parses HTML data, extracts post details, and creates a post element.
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

  // Handle post sorting
  $('.dropdown-item').on('click', function () {
    // Triggers sorting when an item is clicked.
    var sortType = $(this).data('sort');

    // Add the "active" class to the clicked element
    $('.dropdown-item').removeClass('active-sort');
    $(this).addClass('active-sort');

    // Sort the posts
    sortPosts(sortType);
  });

  /**
   * @description Sorts a collection of post articles based on their titles or dates,
   * depending on the provided type parameter. It then updates the DOM by appending the
   * sorted posts to a specified container element.
   *
   * @param {string | 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc'} type -
   * Used to specify sorting criteria.
   *
   * @returns {DOMElement[]} An array containing zero or more DOM elements representing
   * the sorted posts.
   */
  function sortPosts(type) {
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
        case 'title-desc':
          return titleA < titleB ? 1 : -1;
        default:
          return 0;
      }
    });

    // Append the sorted posts to the container
    $('#posts-container').empty().append(posts);
  }

  // Handle post searching
  $('#searchInput').on('keyup', function () {
    // Triggers search functionality.
    var searchTerm = $(this).val().toLowerCase();

    // Loop through each post element
    $('.post-article').each(function () {
      // Filters search results.
      var title = $(this).find('h2').text().toLowerCase();
      var excerpt = $(this).find('.post-content').text().toLowerCase();
      var date = $(this).find('.post-date').text().toLowerCase(); // Pobieramy tekst daty

      // Normalize the date by removing hyphens for easier comparison
      var normalizedDate = date.replace(/-/g, '');
      var normalizedSearchTerm = searchTerm.replace(/-/g, '');

      // Check if the search term matches the title, excerpt, or date
      if (title.includes(searchTerm) || excerpt.includes(searchTerm) || normalizedDate.includes(normalizedSearchTerm)) {
        $(this).show(); // Show the post element if a match is found
      } else {
        $(this).hide(); // Hide the post element if no match is found
      }
    });
  });
});