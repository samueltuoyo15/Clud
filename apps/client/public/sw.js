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

// Push event: display notification when incoming push alert is received
self.addEventListener('push', (event) => {
  let data = { title: 'Clud Alert', body: 'An API specification change was detected.', url: '/dashboard' }
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() }
    }
  } catch (_e) {
    if (event.data) {
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: '/clud-logo-purple-512x512.png',
    badge: '/favicon.svg',
    data: { url: data.url || '/dashboard' },
    vibrate: [100, 50, 100],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Notification click: focus or open dashboard
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = (event.notification.data && event.notification.data.url) || '/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/dashboard') && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    }),
  )
})
