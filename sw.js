// sw.js
const VERSION = 'ovra-v3-20250828';
const PRECACHE = [
  '/', '/index.html',
  '/styles.css?v=2025-08-28',
  '/src/main.js?v=2025-08-28',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(PRECACHE);
    self.skipWaiting();           // 설치 후 즉시 대기 종료
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();   // 새 SW가 모든 클라이언트 장악
  })());
});

// 기본: 네트워크 우선 + 실패 시 캐시(스타일/스크립트는 반대로 캐시 우선)
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const isStatic = url.pathname.endsWith('.css') || url.pathname.endsWith('.js');
  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request).then(resp => {
          const copy = resp.clone();
          caches.open(VERSION).then(c => c.put(e.request, copy));
          return resp;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  } else {
    e.respondWith(
      fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return resp;
      }).catch(() => caches.match(e.request))
    );
  }
});
