const CACHE_NAME = 'medeor-v7';
const OFFLINE_URLS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico',
  '/cpgs',
  '/videos',
  '/rmh',
  '/tools',
  '/reference',
  '/pcc',
  '/pcc/card',
  '/table8',
  '/blog',
  '/meds',
  '/diagrams/ncd.svg',
  '/diagrams/npa.svg',
  '/diagrams/cric.svg',
  '/diagrams/lateral-canthotomy.svg',
  '/diagrams/fasciotomy.svg',
  '/diagrams/escharotomy.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (!url.origin.includes(self.location.origin)) return;

  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match('/')))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => new Response('', { status: 408 }));
      })
    );
  }
});
