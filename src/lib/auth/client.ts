'use client';

import process from 'node:process';

import {
	anonymousClient,
	oneTapClient,
	passkeyClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string,
	plugins: [
		passkeyClient(),
		anonymousClient(),
		oneTapClient({
			autoSelect: false,
			clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
			context: 'signin',
			promptOptions: {
				baseDelay: 1000,
				maxAttempts: 5,
			},
		}),
	],
});

export const { signIn, signOut, signUp, passkey, oneTap, useListPasskeys } =
	authClient;

export function useSession() {
	// Hooks
	// const [credentials, setCredentials] = useState<StoredCredential | null>(null);
	// const network = useNetworkState();
	const session = authClient.useSession();

	// useEffect(() => {
	// 	const { credential, error } = federatedCredentialManager.getCredentials();
	// 	// setCredentials
	// }, [session.data]);

	// useEffect(() => {
	// 	if (!network.online || !credentials) return;
	// 	// Sync credentials
	// }, [network.online]);

	return {
		// credentials: {
		// 	clear: () => setCredentials(null),
		// 	get: () => credentials,
		// 	store: (credential: StoredCredential) => setCredentials(credential),
		// },
		session,
	};
}

// export interface StoredCredential {
// 	id: string;
// 	provider: string;
// 	name?: string;
// 	iconURL?: string;
// 	token?: string;
// 	expiresAt?: number;
// 	refreshToken?: string;
// 	email?: string;
// 	picture?: string;
// 	createdAt: number;
// 	lastUsed: number;
// }

// export interface FederatedCredentialData {
// 	id: string;
// 	provider: 'google';
// 	name?: string;
// 	iconURL?: string;
// 	token?: string;
// }

// class FederatedCredentialManager {
// 	private readonly dbName = 'converse-auth-credentials';
// 	private readonly dbVersion = 1;
// 	private readonly storeName = 'credentials';
// 	private db: IDBDatabase | null = null;

// 	async init(): Promise<void> {
// 		if (this.db) return;

// 		const { data: db, error } = await tryCatch(
// 			new Promise<IDBDatabase>((resolve, reject) => {
// 				const request = indexedDB.open(this.dbName, this.dbVersion);

// 				request.onerror = () => reject(request.error);
// 				request.onsuccess = () => resolve(request.result);

// 				request.onupgradeneeded = (event) => {
// 					const db = (event.target as IDBOpenDBRequest).result;

// 					if (!db.objectStoreNames.contains(this.storeName)) {
// 						const store = db.createObjectStore(this.storeName, {
// 							keyPath: 'id',
// 						});
// 						store.createIndex('provider', 'provider', { unique: false });
// 						store.createIndex('lastUsed', 'lastUsed', { unique: false });
// 					}
// 				};
// 			}),
// 		);

// 		if (error) {
// 			console.error('Failed to initialize credentials database:', error);
// 			throw error;
// 		}

// 		this.db = db!;
// 	}

// 	/**
// 	 * Store Google Sign-In credentials using FederatedCredential API
// 	 */
// 	async storeGoogleCredentials(credentialData: {
// 		id: string;
// 		name?: string;
// 		iconURL?: string;
// 		token?: string;
// 		email?: string;
// 		picture?: string;
// 		expiresAt?: number;
// 		refreshToken?: string;
// 	}): Promise<{ success: boolean; error?: Error }> {
// 		const { error: initError } = await tryCatch(this.init());
// 		if (initError) return { error: initError, success: false };

// 		// Check if FederatedCredential API is supported
// 		if (!window.navigator.credentials) {
// 			return {
// 				error: new Error('Credential Management API not supported'),
// 				success: false,
// 			};
// 		}

// 		try {
// 			// Create FederatedCredential
// 			const federatedCredential = new FederatedCredential({
// 				iconURL: credentialData.iconURL || credentialData.picture,
// 				id: credentialData.id,
// 				name: credentialData.name,
// 				provider: 'google',
// 			});

// 			// Store using Credential Management API
// 			const { error: storeError } = await tryCatch(
// 				navigator.credentials.store(federatedCredential),
// 			);

// 			if (storeError) {
// 				console.warn('Failed to store federated credential:', storeError);
// 			}

// 			// Store additional data in IndexedDB for offline access
// 			const storedCredential: StoredCredential = {
// 				createdAt: Date.now(),
// 				email: credentialData.email,
// 				expiresAt: credentialData.expiresAt,
// 				iconURL: credentialData.iconURL || credentialData.picture,
// 				id: credentialData.id,
// 				lastUsed: Date.now(),
// 				name: credentialData.name,
// 				picture: credentialData.picture,
// 				provider: 'google',
// 				refreshToken: credentialData.refreshToken,
// 				token: credentialData.token,
// 			};

// 			const { error: dbError } = await tryCatch(
// 				this.storeCredentialInDB(storedCredential),
// 			);

// 			return {
// 				error: dbError || undefined,
// 				success: !dbError,
// 			};
// 		} catch (error) {
// 			return {
// 				error: error instanceof Error ? error : new Error('Unknown error'),
// 				success: false,
// 			};
// 		}
// 	}

// 	/**
// 	 * Retrieve credentials using FederatedCredential API with fallback to IndexedDB
// 	 */
// 	async getCredentials(
// 		options: {
// 			mediation?: 'optional' | 'required' | 'silent';
// 			signal?: AbortSignal;
// 		} = {},
// 	): Promise<{ credential?: StoredCredential; error?: Error }> {
// 		const { error: initError } = await tryCatch(this.init());
// 		if (initError) return { error: initError };

// 		// Check online status and API support
// 		const isOnline = navigator.onLine;
// 		const hasCredentialAPI = !!window.navigator.credentials;

// 		if (isOnline && hasCredentialAPI) {
// 			// Try to get from Credential Management API first
// 			const { data: credential, error } = await tryCatch(
// 				navigator.credentials.get({
// 					federated: {
// 						providers: ['google'],
// 					},
// 					mediation: options.mediation || 'optional',
// 					signal: options.signal,
// 				}) as Promise<FederatedCredential | null>,
// 			);

// 			if (!error && credential) {
// 				// Update last used timestamp
// 				await this.updateLastUsed(credential.id);

// 				// Get additional data from IndexedDB
// 				const stored = await this.getCredentialFromDB(credential.id);

// 				return {
// 					credential: stored || {
// 						createdAt: Date.now(),
// 						iconURL: credential.iconURL,
// 						id: credential.id,
// 						lastUsed: Date.now(),
// 						name: credential.name,
// 						provider: credential.provider as 'google',
// 					},
// 				};
// 			}
// 		}

// 		// Fallback to IndexedDB (offline or API unavailable)
// 		const { data: stored, error: dbError } = await tryCatch(
// 			this.getMostRecentCredential(),
// 		);

// 		if (dbError) {
// 			return { error: dbError };
// 		}

// 		if (stored) {
// 			await this.updateLastUsed(stored.id);
// 		}

// 		return { credential: stored || undefined };
// 	}

// 	/**
// 	 * Clear all stored credentials
// 	 */
// 	async clearCredentials(): Promise<{ success: boolean; error?: Error }> {
// 		const { error: initError } = await tryCatch(this.init());
// 		if (initError) return { error: initError, success: false };

// 		// Clear from IndexedDB
// 		const { error: dbError } = await tryCatch(this.clearCredentialsFromDB());

// 		return {
// 			error: dbError || undefined,
// 			success: !dbError,
// 		};
// 	}

// 	/**
// 	 * Check if credentials exist
// 	 */
// 	async hasStoredCredentials(): Promise<boolean> {
// 		const { error: initError } = await tryCatch(this.init());
// 		if (initError) return false;

// 		const { data: credentials } = await tryCatch(this.getAllCredentials());
// 		return (credentials?.length || 0) > 0;
// 	}

// 	// Private methods for IndexedDB operations
// 	private async storeCredentialInDB(
// 		credential: StoredCredential,
// 	): Promise<void> {
// 		if (!this.db) throw new Error('Database not initialized');

// 		return new Promise((resolve, reject) => {
// 			const transaction = this.db!.transaction([this.storeName], 'readwrite');
// 			const store = transaction.objectStore(this.storeName);

// 			const request = store.put(credential);

// 			request.onsuccess = () => resolve();
// 			request.onerror = () => reject(request.error);
// 		});
// 	}

// 	private async getCredentialFromDB(
// 		id: string,
// 	): Promise<StoredCredential | null> {
// 		if (!this.db) return null;

// 		return new Promise((resolve, reject) => {
// 			const transaction = this.db!.transaction([this.storeName], 'readonly');
// 			const store = transaction.objectStore(this.storeName);

// 			const request = store.get(id);

// 			request.onsuccess = () => resolve(request.result || null);
// 			request.onerror = () => reject(request.error);
// 		});
// 	}

// 	private async getMostRecentCredential(): Promise<StoredCredential | null> {
// 		if (!this.db) return null;

// 		return new Promise((resolve, reject) => {
// 			const transaction = this.db!.transaction([this.storeName], 'readonly');
// 			const store = transaction.objectStore(this.storeName);
// 			const index = store.index('lastUsed');

// 			const request = index.openCursor(null, 'prev');

// 			request.onsuccess = () => {
// 				const cursor = request.result;
// 				resolve(cursor ? cursor.value : null);
// 			};

// 			request.onerror = () => reject(request.error);
// 		});
// 	}

// 	private async getAllCredentials(): Promise<StoredCredential[]> {
// 		if (!this.db) return [];

// 		return new Promise((resolve, reject) => {
// 			const transaction = this.db!.transaction([this.storeName], 'readonly');
// 			const store = transaction.objectStore(this.storeName);

// 			const request = store.getAll();

// 			request.onsuccess = () => resolve(request.result || []);
// 			request.onerror = () => reject(request.error);
// 		});
// 	}

// 	private async updateLastUsed(id: string): Promise<void> {
// 		const credential = await this.getCredentialFromDB(id);
// 		if (credential) {
// 			credential.lastUsed = Date.now();
// 			await this.storeCredentialInDB(credential);
// 		}
// 	}

// 	private async clearCredentialsFromDB(): Promise<void> {
// 		if (!this.db) return;

// 		return new Promise((resolve, reject) => {
// 			const transaction = this.db!.transaction([this.storeName], 'readwrite');
// 			const store = transaction.objectStore(this.storeName);

// 			const request = store.clear();

// 			request.onsuccess = () => resolve();
// 			request.onerror = () => reject(request.error);
// 		});
// 	}
// }

// export const federatedCredentialManager = new FederatedCredentialManager();
