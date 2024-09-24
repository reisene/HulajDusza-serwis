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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event listener
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
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
                // Cache the new response
                caches.open(CACHE_NAME)
                  .then((cache) => {
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
              // Cache the new response
              caches.open(CACHE_NAME)
                .then((cache) => {
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
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
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
  if (event.data) {
    console.log('Received push data:', event.data.text());
  } else {
    console.log('Received empty push data');
  }
});

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll().then((clients) => {
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});