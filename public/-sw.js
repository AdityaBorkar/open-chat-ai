// Service Worker for T3 Chat Offline Mode
const CACHE_VERSION = 'v1';
const CACHE_NAMES = {
	api: `api-cache-${CACHE_VERSION}`,
	images: `images-cache-${CACHE_VERSION}`,
	runtime: `runtime-cache-${CACHE_VERSION}`,
	static: `static-cache-${CACHE_VERSION}`,
};

const STATIC_CACHE_URLS = ['/', '/chat', '/settings', '/offline'];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
	event.waitUntil(
		Promise.all([
			caches.open(CACHE_NAMES.static).then((cache) => {
				return cache.addAll(STATIC_CACHE_URLS);
			}),
			// Skip waiting to activate immediately
			self.skipWaiting(),
		]),
	);
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		Promise.all([
			// Clean up old caches
			caches
				.keys()
				.then((cacheNames) => {
					return Promise.all(
						cacheNames.map((cacheName) => {
							if (!Object.values(CACHE_NAMES).includes(cacheName)) {
								return caches.delete(cacheName);
							}
						}),
					);
				}),
			// Take control of all clients
			self.clients.claim(),
			// Notify clients that SW is activated
			self.clients
				.matchAll()
				.then((clients) => {
					clients.forEach((client) => {
						client.postMessage({
							timestamp: Date.now(),
							type: 'SW_ACTIVATED',
						});
					});
				}),
		]),
	);
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Handle API requests
	if (url.pathname.startsWith('/api/')) {
		event.respondWith(handleApiRequest(request));
		return;
	}

	// Handle navigation requests
	if (request.mode === 'navigate') {
		event.respondWith(handleNavigationRequest(request));
		return;
	}

	// Handle static assets
	if (
		request.destination === 'script' ||
		request.destination === 'style' ||
		request.destination === 'image'
	) {
		event.respondWith(handleStaticAsset(request));
		return;
	}

	// Default: try network first, then cache
	event.respondWith(
		fetch(request).catch(() => {
			return caches.match(request);
		}),
	);
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
	const cache = await caches.open(CACHE_NAMES.api);

	try {
		// Try network first
		const networkResponse = await fetch(request);

		if (networkResponse.ok) {
			// Cache successful responses
			cache.put(request, networkResponse.clone());
			return networkResponse;
		}

		throw new Error(`HTTP ${networkResponse.status}`);
	} catch (_error) {
		// Try cache if network fails
		const cachedResponse = await cache.match(request);
		if (cachedResponse) {
			return cachedResponse;
		}

		// Handle chat API specifically
		if (request.url.includes('/api/chat')) {
			// Store message for background sync
			await storeFailedRequest(request);

			return new Response(
				JSON.stringify({
					error: 'Offline - message queued for sync',
					queued: true,
					timestamp: Date.now(),
				}),
				{
					headers: { 'Content-Type': 'application/json' },
					status: 202,
				},
			);
		}

		// Return offline response for other APIs
		return new Response(
			JSON.stringify({ error: 'Offline', timestamp: Date.now() }),
			{
				headers: { 'Content-Type': 'application/json' },
				status: 503,
			},
		);
	}
}

// Handle navigation requests
async function handleNavigationRequest(request) {
	try {
		// Try network first with timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 3000);

		const networkResponse = await fetch(request, {
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (networkResponse.ok) {
			// Cache the page
			const cache = await caches.open(CACHE_NAMES.runtime);
			cache.put(request, networkResponse.clone());
			return networkResponse;
		}
	} catch (_error) {}

	// Try cache
	const cache = await caches.open(CACHE_NAMES.runtime);
	const cachedResponse = await cache.match(request);
	if (cachedResponse) {
		return cachedResponse;
	}

	// Return offline page
	return getOfflinePage();
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
	const cacheName =
		request.destination === 'image' ? CACHE_NAMES.images : CACHE_NAMES.static;
	const cache = await caches.open(cacheName);

	// Try cache first
	const cachedResponse = await cache.match(request);
	if (cachedResponse) {
		return cachedResponse;
	}

	// Try network and cache
	try {
		const networkResponse = await fetch(request);
		if (networkResponse.ok) {
			cache.put(request, networkResponse.clone());
			return networkResponse;
		}
	} catch (_error) {}

	// Return fallback or cached version
	return (
		cache.match('/fallback-image.png') || new Response('', { status: 404 })
	);
}

// Store failed requests for background sync
async function storeFailedRequest(request) {
	try {
		const requestData = {
			body: request.method !== 'GET' ? await request.text() : null,
			headers: Object.fromEntries(request.headers.entries()),
			method: request.method,
			timestamp: Date.now(),
			url: request.url,
		};

		// Store in IndexedDB or localStorage for later sync
		const stored = localStorage.getItem('failed-requests') || '[]';
		const failedRequests = JSON.parse(stored);
		failedRequests.push(requestData);
		localStorage.setItem('failed-requests', JSON.stringify(failedRequests));

		// Notify client about queued request
		self.clients.matchAll().then((clients) => {
			clients.forEach((client) => {
				client.postMessage({
					data: { timestamp: Date.now(), url: request.url },
					type: 'MESSAGE_QUEUED',
				});
			});
		});
	} catch (_error) {}
}

// Get offline page HTML
function getOfflinePage() {
	const offlineHtml = `
		<!DOCTYPE html>
		<html>
			<head>
				<title>Offline - T3 Chat</title>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<style>
					body {
						font-family: system-ui, -apple-system, sans-serif;
						display: flex;
						align-items: center;
						justify-content: center;
						min-height: 100vh;
						margin: 0;
						background: #1a1a1a;
						color: #fff;
						text-align: center;
					}
					.offline-container {
						max-width: 400px;
						padding: 2rem;
					}
					.offline-icon {
						font-size: 4rem;
						margin-bottom: 1rem;
					}
					.btn {
						background: #3b82f6;
						color: white;
						border: none;
						padding: 0.75rem 1.5rem;
						border-radius: 0.5rem;
						cursor: pointer;
						margin: 0.5rem;
						text-decoration: none;
						display: inline-block;
					}
					.btn:hover {
						background: #2563eb;
					}
					.status {
						margin: 1rem 0;
						padding: 0.5rem;
						border-radius: 0.25rem;
						background: #374151;
					}
				</style>
			</head>
			<body>
				<div className="offline-container">
					<div className="offline-icon">📡</div>
					<h1>You're Offline</h1>
					<p>Don't worry! Your conversations are saved locally and will sync when you're back online.</p>
					<div className="status" id="sync-status">
						<span id="pending-count">0</span> messages pending sync
					</div>
					<Link href="/" className="btn">Try Again</a>
					<button onclick="window.location.reload()" className="btn">Reload</button>
				</div>
				<script>
					// Check for pending messages
					const failedRequests = JSON.parse(localStorage.getItem('failed-requests') || '[]');
					document.getElementById('pending-count').textContent = failedRequests.length;

					// Listen for online status
					window.addEventListener('online', () => {
						window.location.reload();
					});
				</script>
			</body>
		</html>
	`;

	return new Response(offlineHtml, {
		headers: { 'Content-Type': 'text/html' },
	});
}

// Handle background sync
self.addEventListener('sync', (event) => {
	if (event.tag === 'chat-sync') {
		event.waitUntil(syncFailedRequests());
	}
});

// Sync failed requests when back online
async function syncFailedRequests() {
	try {
		const stored = localStorage.getItem('failed-requests') || '[]';
		const failedRequests = JSON.parse(stored);

		if (failedRequests.length === 0) {
			return;
		}

		const syncedRequests = [];

		for (const requestData of failedRequests) {
			try {
				const response = await fetch(requestData.url, {
					body: requestData.body,
					headers: requestData.headers,
					method: requestData.method,
				});

				if (response.ok) {
					syncedRequests.push(requestData);

					// Notify client of successful sync
					self.clients.matchAll().then((clients) => {
						clients.forEach((client) => {
							client.postMessage({
								data: { url: requestData.url },
								type: 'SYNC_SUCCESS',
							});
						});
					});
				}
			} catch (_error) {}
		}

		// Remove synced requests
		const remainingRequests = failedRequests.filter(
			(req) => !syncedRequests.includes(req),
		);
		localStorage.setItem('failed-requests', JSON.stringify(remainingRequests));
	} catch (_error) {}
}

// Listen for client messages
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}

	if (event.data && event.data.type === 'GET_OFFLINE_STATUS') {
		event.ports[0].postMessage({
			isOnline: navigator.onLine,
			pendingSync: JSON.parse(localStorage.getItem('failed-requests') || '[]')
				.length,
			type: 'OFFLINE_STATUS',
		});
	}

	if (event.data && event.data.type === 'FORCE_SYNC') {
		syncFailedRequests().catch((error) => {
			console.error(error);
		});
	}
});

// Export for debugging
self.CACHE_NAMES = CACHE_NAMES;
