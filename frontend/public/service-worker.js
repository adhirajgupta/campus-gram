const CACHE_NAME = 'myapp-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/icons/splash.png',
  '/icons/adaptive-icon.png'
];

// Install event: cache files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('myapp-cache-v1')
      .then((cache) => cache.addAll([
        '/',
        '/index.html',
  '/icons/splash.png',
  '/icons/adaptive-icon.png'
      ]))
      .then(() => self.skipWaiting()) // Force activation
  );
});


// Activate event: take control immediately
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Fetch event: serve cached files first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('/offline.html'));
    })
  );
});
