// Define the cache name and the URLs to cache
const CACHE_NAME = 'hulajdusza-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/content/cookies.html',
  '/content/pricing.html',
  '/content/privacy.html',
  '/css/style.css',
  '/css/index.css',
  '/css/services.css',
  '/css/about.css',
  '/css/contact.css',
  '/css/pricing.css',
  '/css/privacy.css',
  '/js/script.js',
  '/js/send_email.js',
  '/js/phone_format.js',
  '/js/sharing-buttons.js',
  '/js/counters.js',
  '/icons/favicon-32x32.png',
  '/icons/apple-icon-57x57.png',
  '/img/Logo/HulajDusza_logo.png'
];

// Define the cache expiration time (in days)
const cacheExpirationTime = 30;

// Install event listener
self.addEventListener('install', (event) => {
  // Handles service worker installation.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Adds resources to a cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event listener
self.addEventListener('fetch', (event) => {
  // Handles fetch events with caching and expiration.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Checks and caches responses.
        if (response) {
          // If the response is cached, check if it's expired
          const cachedResponseDate = response.headers.get('date');
          const currentDate = new Date();
          const expirationDate = new Date(cachedResponseDate);
          expirationDate.setDate(expirationDate.getDate() + cacheExpirationTime);

          if (currentDate > expirationDate) {
            // If the response is expired, fetch a new one from the network
            return fetch(event.request)
              .then((newResponse) => {
                // Caches responses to requests.
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    // Caches a response.
                    cache.put(event.request, newResponse.clone());
                  });
                return newResponse;
              });
          } else {
            // If the response is not expired, return the cached one
            return response;
          }
        } else {
          // If the response is not cached, fetch a new one from the network
          return fetch(event.request)
            .then((newResponse) => {
              // Caches and returns a response.
              caches.open(CACHE_NAME)
                .then((cache) => {
                  // Caches a HTTP response.
                  cache.put(event.request, newResponse.clone());
                });
              return newResponse;
            });
        }
      })
  );
});

// Activate event listener
self.addEventListener('activate', (event) => {
  // Clears unwanted browser caches.
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Deletes unwanted caches.
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Deletes an unauthorized cache.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Push event listener
self.addEventListener('push', (event) => {
  // Handles incoming push notifications.
  // 
  // However, a more accurate description would be:
  // 
  // The invocation listens for and processes incoming push events.
  // 
  // Or simply: This invocation receives push notifications.
  if (event.data) {
    console.log('Received push data:', event.data.text());
  } else {
    console.log('Received empty push data');
  }
});

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  // Handles notification clicks.
  event.notification.close();
  event.waitUntil(
    clients.matchAll().then((clients) => {
      // Opens a new window.
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});