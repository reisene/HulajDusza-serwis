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

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

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
