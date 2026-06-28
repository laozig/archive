const CACHE_NAME = 'laozig-v8';
const STATIC_ASSETS = [
    '/',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/robots.txt',
    '/vendor/purify.min.js',
    '/vendor/marked.min.js',
    '/vendor/prism.min.js',
    '/vendor/prism-javascript.min.js',
    '/vendor/prism-python.min.js',
    '/vendor/prism-bash.min.js',
    '/vendor/prism-c.min.js',
    '/vendor/prism-json.min.js'
];

function putInCache(request, response) {
    if (!response || !response.ok) return Promise.resolve();
    const cacheControl = (response.headers.get('Cache-Control') || '').toLowerCase();
    if (cacheControl.includes('no-store')) return Promise.resolve();
    return caches.open(CACHE_NAME).then(cache => cache.put(request, response));
}

function networkFirst(request, shouldCache = true) {
    return fetch(request)
        .then(response => {
            if (shouldCache) {
                putInCache(request, response.clone());
            }
            return response;
        })
        .catch(() => caches.match(request));
}

function cacheFirst(request) {
    return caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
            putInCache(request, response.clone());
            return response;
        });
    });
}

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    const isSameOrigin = url.origin === self.location.origin;
    const isDocumentAsset = event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css');
    const isStaticAsset = event.request.destination === 'image' || event.request.destination === 'font';
    const isApiRequest = url.pathname.startsWith('/api/');

    if (!isSameOrigin) {
        return;
    }

    if (isDocumentAsset) {
        event.respondWith(networkFirst(event.request));
        return;
    }

    if (isStaticAsset) {
        event.respondWith(cacheFirst(event.request));
        return;
    }

    if (isApiRequest) {
        event.respondWith(networkFirst(event.request, false));
        return;
    }

    event.respondWith(networkFirst(event.request));
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        event.waitUntil(Promise.resolve());
    }
});

self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New notification'
    };
    event.waitUntil(self.registration.showNotification('LAOZIG', options));
});
