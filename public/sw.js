// shrimpAI Service Worker for PWA
const CACHE_NAME = 'shrimpai-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Network-first strategy for smooth updates
self.addEventListener('fetch', (event) => {
  // Chỉ can thiệp vào các request GET cho static assets/trang, tuyệt đối không can thiệp vào request POST/API
  const url = new URL(event.request.url);
  if (
    event.request.method !== 'GET' ||
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/chat') ||
    url.pathname.startsWith('/users') ||
    url.pathname.startsWith('/shrimp-analysis') ||
    url.pathname.startsWith('/api')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
