self.addEventListener('install', e=>{
  e.waitUntil(caches.open('ovra-v1').then(c=>c.addAll(['/','/index.html','/styles.css','/src/main.js','/src/store.js','/src/users.js','/src/moderation.js','/src/components.js'])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(res=> res || fetch(e.request)));
});
