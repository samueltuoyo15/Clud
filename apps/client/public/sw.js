const CACHE_NAME = 'clud-cache-v1'
const STATIC_ASSETS = [
  '/',
  '/favicon-white.svg',
  '/index.html',
]

// Install event: cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  )
  self.skipWaiting()
})

// Activate event: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        }),
      ),
    ),
  )
  self.clients.claim()
})

// Fetch event: smart caching
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // Skip non-GET requests and API calls
  if (request.method !== 'GET' || url.pathname.startsWith('/auth') || url.pathname.startsWith('/projects') || url.pathname.startsWith('/workspaces') || url.pathname.startsWith('/integrations') || url.pathname.startsWith('/notifications')) {
    return
  }

  // Cache-First strategy for images and avatar assets (including external URLs like avatars)
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico)$/i) ||
    url.hostname.includes('glint-dev.vercel.app') ||
    url.hostname.includes('avatars.githubusercontent.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone())
              }
              return networkResponse
            })
            .catch(() => cachedResponse)

          return cachedResponse || fetchPromise
        }),
      ),
    )
    return
  }

  // Network-First with Cache Fallback for HTML/CSS/JS navigation
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return networkResponse
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached
          if (request.mode === 'navigate') {
            return caches.match('/index.html')
          }
        })
      }),
  )
})
