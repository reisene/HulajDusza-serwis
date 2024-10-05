// Define the cache name and the URLs to cache
const CACHE_NAME = 'hulajdusza-cache-v1'
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
]

// Define the cache expiration time (in days)
const cacheExpirationTime = 30

// Install event listener
self.addEventListener('install', (event) => {
  // Initializes a service worker during installation.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  )
})

// Fetch event listener
self.addEventListener('fetch', (event) => {
  // Handles browser requests for caching purposes.
  event.respondWith(
    (async function () {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(event.request)

      if (cachedResponse) {
        const cachedResponseDate = cachedResponse.headers.get('date')
        const currentDate = new Date()
        const expirationDate = new Date(cachedResponseDate)
        expirationDate.setDate(expirationDate.getDate() + cacheExpirationTime)

        if (currentDate > expirationDate) {
          const newResponse = await fetch(event.request)
          await cache.put(event.request, newResponse.clone())
          return newResponse
        } else {
          return cachedResponse
        }
      } else {
        const newResponse = await fetch(event.request)
        await cache.put(event.request, newResponse.clone())
        return newResponse
      }
    })()
  )
})

// Activate event listener
self.addEventListener('activate', (event) => {
  // Cleans old cache names during service worker activation.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Deletes non-matching caches.
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Deletes cache entries.
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Push event listener
self.addEventListener('push', (event) => {
  // Handles incoming push notifications.
  if (event.data) {
    console.log('Received push data:', event.data.text())
  } else {
    console.log('Received empty push data')
  }
})

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  // Handles notification clicks.
  event.notification.close()
  event.waitUntil(
    clients.matchAll().then((clients) => {
      // Opens a new browser window to root URL.
      if (clients.openWindow) {
        return clients.openWindow('/')
      }
    })
  )
})
