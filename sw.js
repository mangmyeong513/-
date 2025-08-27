const VERSION='ovra-v3-20250828';
const PRECACHE=['/','/index.html','/styles.css?v=20250828','/src/main.js?v=20250828','/manifest.json'];

self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(VERSION);
    await c.addAll(PRECACHE);
    self.skipWaiting();
  })());
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const ks=await caches.keys();
    await Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
