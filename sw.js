'use strict';

const CACHE_VERSION = 'storypot-dark-v13';
const ASSETS = [
    './',
    './index.html',
    './home.css',
    './home.js',
    './recorder.html',
    './style.css',
    './app.js',
    './card.html',
    './manifest.json',
    './booknotelogo.png',
    './booknotelogo2.png',
    './booknotelogo-team.png'
];

self.addEventListener('install', (event) => {
    // Use individual cache.put() calls instead of cache.addAll() so that
    // a missing file (e.g., a logo variant not yet uploaded) doesn't
    // abort the entire install. Each asset is fetched independently;
    // failures are logged and skipped.
    event.waitUntil(
        caches.open(CACHE_VERSION).then(cache => {
            return Promise.all(ASSETS.map(url => {
                return fetch(url).then(resp => {
                    if (resp && resp.status === 200) {
                        return cache.put(url, resp);
                    }
                    console.warn('[sw] Skipping cache for missing asset:', url);
                }).catch(err => {
                    console.warn('[sw] Cache fetch failed for', url, err);
                });
            }));
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    if (new URL(req.url).origin !== self.location.origin) return;

    event.respondWith(
        fetch(req).then(resp => {
            if (resp && resp.status === 200) {
                const clone = resp.clone();
                caches.open(CACHE_VERSION).then(c => c.put(req, clone));
            }
            return resp;
        }).catch(() =>
            caches.match(req).then(cached => cached || caches.match('./index.html'))
        )
    );
});
