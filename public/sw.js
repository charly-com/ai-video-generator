// public/sw.js — ViralMint Service Worker

const CACHE_VERSION = 'viralmint-v1.0.0'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`
const IMAGE_CACHE = `${CACHE_VERSION}-images`

const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/offline',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('[SW] Pre-caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('viralmint-') && k !== STATIC_CACHE && k !== DYNAMIC_CACHE && k !== IMAGE_CACHE)
          .map(k => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// ─── Fetch Strategy ───────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and browser-sync
  if (request.method !== 'GET') return
  if (url.pathname.startsWith('/api/')) return
  if (url.hostname !== self.location.hostname) {
    // For CDN images (generated content), use cache-first
    if (url.hostname.includes('fal.media') || url.hostname.includes('cloudflare')) {
      event.respondWith(cacheFirst(request, IMAGE_CACHE, 7 * 24 * 60 * 60))
      return
    }
    return
  }

  // Navigation — network first, fallback to cached version, then offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone))
          }
          return response
        })
        .catch(() =>
          caches.match(request).then(cached => cached || caches.match('/offline'))
        )
    )
    return
  }

  // Static assets — cache first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Everything else — stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request))
})

async function cacheFirst(request, cacheName, maxAgeSeconds = 0) {
  const cached = await caches.match(request)
  if (cached) {
    // Check age if maxAge specified
    if (maxAgeSeconds > 0) {
      const dateHeader = cached.headers.get('date')
      if (dateHeader) {
        const age = (Date.now() - new Date(dateHeader).getTime()) / 1000
        if (age > maxAgeSeconds) {
          return fetchAndCache(request, cacheName)
        }
      }
    }
    return cached
  }
  return fetchAndCache(request, cacheName)
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)
  const fetchPromise = fetchAndCache(request, DYNAMIC_CACHE)
  return cached || fetchPromise
}

async function fetchAndCache(request, cacheName) {
  const response = await fetch(request)
  if (response.ok) {
    const cache = await caches.open(cacheName)
    cache.put(request, response.clone())
  }
  return response
}

// ─── Push Notifications ───────────────────────────────────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return

  let data
  try {
    data = event.data.json()
  } catch {
    data = { title: 'ViralMint', body: event.data.text() }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    image: data.image,
    tag: data.tag || 'viralmint',
    data: data.url ? { url: data.url } : {},
    actions: data.actions || [],
    vibrate: [100, 50, 100],
    requireInteraction: data.requireInteraction || false,
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'ViralMint', options)
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/dashboard'
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      return clients.openWindow(url)
    })
  )
})

// ─── Background Sync (retry failed publishes) ─────────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'retry-publish') {
    event.waitUntil(retryFailedPublishes())
  }
})

async function retryFailedPublishes() {
  const cache = await caches.open('viralmint-pending-publishes')
  const requests = await cache.keys()

  for (const request of requests) {
    try {
      const cached = await cache.match(request)
      const body = await cached.json()

      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        await cache.delete(request)
      }
    } catch (error) {
      console.log('[SW] Retry failed, will try again:', error)
    }
  }
}

// ─── Periodic Background Sync (refresh trends) ───────────────────────────────
self.addEventListener('periodicsync', event => {
  if (event.tag === 'refresh-trends') {
    event.waitUntil(
      fetch('/api/trending?background=1')
        .then(r => r.json())
        .then(data => {
          // Cache updated trends
          caches.open(DYNAMIC_CACHE).then(cache =>
            cache.put('/api/trending', new Response(JSON.stringify(data)))
          )
        })
        .catch(() => {})
    )
  }
})

// ─── Message handler ──────────────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data?.type === 'CACHE_CONTENT') {
    const { url } = event.data
    caches.open(IMAGE_CACHE).then(cache => {
      fetch(url).then(r => cache.put(url, r))
    })
  }
})