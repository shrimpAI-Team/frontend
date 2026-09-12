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
  const url = new URL(event.request.url);

  // Bỏ qua tài nguyên bên ngoài (Google, Facebook, Zalo) và các điều hướng trang nội bộ
  if (url.origin !== self.location.origin || event.request.mode === 'navigate') {
    return;
  }

  // Chỉ can thiệp vào các request GET cho static assets nội bộ, không can thiệp vào API
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
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
