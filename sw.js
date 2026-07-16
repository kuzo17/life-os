// ══════════════════════════════════════════════════════════
// LIFE OS — Service Worker
//
// IMPORTANTE: incrementare CACHE_VERSION ad ogni deploy con modifiche
// rilevanti (es. v1 -> v2). Questo è ciò che permette al Service Worker
// di eliminare automaticamente la cache vecchia e servire sempre la
// versione corretta, senza che l'utente debba mai disinstallare/
// reinstallare l'app.
// ══════════════════════════════════════════════════════════
const CACHE_VERSION = 'v2';
const CACHE_NAME = `lifeos-${CACHE_VERSION}`;

// App shell minimo — solo ciò che serve per aprire l'app offline.
// Le risorse esterne (font, Chart.js) vengono messe in cache al primo
// utilizzo tramite la strategia fetch, non precaricate qui.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()) // attiva subito la nuova versione, non aspetta la chiusura di tutte le tab
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('lifeos-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key)) // elimina ogni cache di versioni precedenti
      )
    ).then(() => self.clients.claim()) // prende il controllo delle tab già aperte, senza richiedere un reload
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // non intercetta POST/altre richieste non idempotenti

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    // App shell (HTML/manifest/icone proprie): network-first, con fallback alla cache se offline.
    // Garantisce che online si veda sempre l'ultima versione pubblicata.
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
  } else {
    // Risorse esterne (font, Chart.js da CDN): cache-first, aggiornate raramente.
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res.ok) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        }).catch(() => cached);
      })
    );
  }
});
