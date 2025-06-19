'use client';

// Service Worker registration and utilities for T3 Chat

export interface OfflineStatus {
	isOnline: boolean;
	pendingSync: number;
	lastSync?: Date;
}

export interface SyncMessage {
	type: 'SYNC_SUCCESS' | 'SYNC_FAILED' | 'MESSAGE_QUEUED' | 'SW_ACTIVATED';
	data?: unknown;
	timestamp?: number;
}

class ServiceWorkerManager {
	private sw: ServiceWorker | null = null;
	private readonly callbacks: Map<string, ((data: SyncMessage) => void)[]> =
		new Map();

	async register(): Promise<ServiceWorkerRegistration | null> {
		if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
			return null;
		}

		try {
			const registration = await navigator.serviceWorker.register('/sw.js', {
				scope: '/',
			});

			// Listen for updates
			registration.addEventListener('updatefound', () => {
				const newWorker = registration.installing;
				if (newWorker) {
					newWorker.addEventListener('statechange', () => {
						if (
							newWorker.state === 'installed' &&
							navigator.serviceWorker.controller
						) {
							this.notifyUpdate();
						}
					});
				}
			});

			// Listen for messages from service worker
			navigator.serviceWorker.addEventListener('message', (event) => {
				this.handleMessage(event.data);
			});

			// Get the active service worker
			if (registration.active) {
				this.sw = registration.active;
			} else if (registration.waiting) {
				this.sw = registration.waiting;
			} else if (registration.installing) {
				this.sw = registration.installing;
			}

			return registration;
		} catch (_error) {
			return null;
		}
	}

	private handleMessage(data: SyncMessage) {
		const callbacks = this.callbacks.get(data.type) || [];
		callbacks.forEach((callback) => callback(data));

		// Trigger global callbacks
		const globalCallbacks = this.callbacks.get('*') || [];
		globalCallbacks.forEach((callback) => callback(data));
	}

	private notifyUpdate() {
		// Notify components about SW update
		const callbacks = this.callbacks.get('UPDATE_AVAILABLE') || [];
		callbacks.forEach((callback) => callback({ type: 'SW_ACTIVATED' }));
	}

	on(event: string, callback: (data: SyncMessage) => void) {
		if (!this.callbacks.has(event)) {
			this.callbacks.set(event, []);
		}
		this.callbacks.get(event)?.push(callback);
	}

	off(event: string, callback: (data: SyncMessage) => void) {
		const callbacks = this.callbacks.get(event);
		if (callbacks) {
			const index = callbacks.indexOf(callback);
			if (index > -1) {
				callbacks.splice(index, 1);
			}
		}
	}

	async getOfflineStatus(): Promise<OfflineStatus> {
		if (!this.sw) {
			return {
				isOnline: navigator.onLine,
				pendingSync: 0,
			};
		}

		return new Promise((resolve) => {
			const channel = new MessageChannel();

			channel.port1.onmessage = (event) => {
				if (event.data.type === 'OFFLINE_STATUS') {
					resolve({
						isOnline: event.data.isOnline,
						lastSync: event.data.lastSync
							? new Date(event.data.lastSync)
							: undefined,
						pendingSync: event.data.pendingSync || 0,
					});
				}
			};

			if (this.sw) {
				this.sw.postMessage(
					{
						type: 'GET_OFFLINE_STATUS',
					},
					[channel.port2],
				);
			}

			// Timeout fallback
			setTimeout(() => {
				resolve({
					isOnline: navigator.onLine,
					pendingSync: 0,
				});
			}, 1000);
		});
	}

	async forceSync() {
		if (this.sw) {
			this.sw.postMessage({ type: 'FORCE_SYNC' });
		}
	}

	async skipWaiting() {
		if (this.sw) {
			this.sw.postMessage({ type: 'SKIP_WAITING' });
		}
	}

	// Check if app is running offline
	isOffline(): boolean {
		return !navigator.onLine;
	}

	// Get pending sync count from localStorage
	getPendingSyncCount(): number {
		try {
			const failedRequests = localStorage.getItem('failed-requests') || '[]';
			return JSON.parse(failedRequests).length;
		} catch {
			return 0;
		}
	}

	// Clear all offline data
	async clearOfflineData() {
		try {
			localStorage.removeItem('failed-requests');

			// Clear caches
			const cacheNames = await caches.keys();
			await Promise.all(
				cacheNames.map((cacheName) => caches.delete(cacheName)),
			);
		} catch (_error) {}
	}
}

// Create singleton instance
export const swManager = new ServiceWorkerManager();

// Initialize service worker
export async function initServiceWorker() {
	if (typeof window !== 'undefined') {
		await swManager.register();

		// Register background sync if supported
		if ('serviceWorker' in navigator) {
			try {
				const registration = await navigator.serviceWorker.ready;
				// Check if sync is supported
				if ('sync' in registration) {
					// @ts-expect-error - Type error
					await registration.sync?.register('chat-sync');
				}
			} catch (_error) {}
		}
	}
}

// Utility functions for offline handling
export function isOnline(): boolean {
	return navigator.onLine;
}

export function onOfflineStatusChange(callback: (isOnline: boolean) => void) {
	const handleOnline = () => callback(true);
	const handleOffline = () => callback(false);

	window.addEventListener('online', handleOnline);
	window.addEventListener('offline', handleOffline);

	// Return cleanup function
	return () => {
		window.removeEventListener('online', handleOnline);
		window.removeEventListener('offline', handleOffline);
	};
}

// Enhanced fetch with offline handling
export async function offlineFetch(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	try {
		const response = await fetch(input, init);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		return response;
	} catch (error) {
		// Check if this was queued for background sync
		const url = typeof input === 'string' ? input : input.toString();
		if (url.includes('/api/chat')) {
			// Return a response indicating the message was queued
			return new Response(
				JSON.stringify({
					error: 'Message queued for sync',
					queued: true,
					timestamp: Date.now(),
				}),
				{
					headers: { 'Content-Type': 'application/json' },
					status: 202,
				},
			);
		}

		throw error;
	}
}

export default swManager;
