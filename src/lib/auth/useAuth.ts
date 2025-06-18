'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

import { signIn, signOut, useSession } from '@/lib/auth/client';
import { tryCatch } from '@/lib/tryCatch';
import {
	federatedCredentialManager,
	type StoredCredential,
} from './federated-credentials';

export interface AuthState {
	user: any | null;
	session: any | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	isOnline: boolean;
	hasOfflineCredentials: boolean;
	lastSyncTime: number | null;
	error: Error | null;
}

export interface AuthActions {
	login: (options?: {
		force?: boolean;
		mediation?: 'optional' | 'required' | 'silent';
	}) => Promise<{ success: boolean; error?: Error }>;
	logout: () => Promise<{ success: boolean; error?: Error }>;
	syncCredentials: () => Promise<{ success: boolean; error?: Error }>;
	clearOfflineCredentials: () => Promise<{ success: boolean; error?: Error }>;
}

// Global state for online/offline status
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let onlineListeners: (() => void)[] = [];

// Subscribe to online/offline events
if (typeof window !== 'undefined') {
	const updateOnlineStatus = () => {
		const newOnlineStatus = navigator.onLine;
		if (newOnlineStatus !== isOnline) {
			isOnline = newOnlineStatus;
			onlineListeners.forEach((callback) => callback());
		}
	};

	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);
}

// External store for online status
const onlineStore = {
	getServerSnapshot: () => true,
	getSnapshot: () => isOnline, // Always online on server
	subscribe: (callback: () => void) => {
		onlineListeners.push(callback);
		return () => {
			onlineListeners = onlineListeners.filter((l) => l !== callback);
		};
	},
};

export function useAuth(): AuthState & AuthActions {
	const session = useSession();
	const currentIsOnline = useSyncExternalStore(
		onlineStore.subscribe,
		onlineStore.getSnapshot,
		onlineStore.getServerSnapshot,
	);

	const [offlineState, setOfflineState] = useState<{
		hasOfflineCredentials: boolean;
		lastSyncTime: number | null;
		error: Error | null;
	}>({
		error: null,
		hasOfflineCredentials: false,
		lastSyncTime: null,
	});

	// Check for offline credentials on mount
	useEffect(() => {
		let mounted = true;

		const checkOfflineCredentials = async () => {
			const { data: hasCredentials } = await tryCatch(
				federatedCredentialManager.hasStoredCredentials(),
			);

			if (mounted) {
				setOfflineState((prev) => ({
					...prev,
					hasOfflineCredentials: hasCredentials || false,
				}));
			}
		};

		checkOfflineCredentials();

		return () => {
			mounted = false;
		};
	}, []);

	// Handle Google Sign-In success
	const handleGoogleSignInSuccess = useCallback(async (credential: any) => {
		if (!credential) return;

		const { error } = await tryCatch(
			federatedCredentialManager.storeGoogleCredentials({
				email: credential.email,
				expiresAt: credential.expires_at,
				id: credential.email || credential.sub || credential.id,
				name: credential.name,
				picture: credential.picture,
				refreshToken: credential.refresh_token,
				token: credential.access_token,
			}),
		);

		if (error) {
			console.warn('Failed to store federated credentials:', error);
		} else {
			setOfflineState((prev) => ({
				...prev,
				error: null,
				hasOfflineCredentials: true,
				lastSyncTime: Date.now(),
			}));
		}
	}, []);

	// Login function with offline support
	const login = useCallback(
		async (
			options: {
				force?: boolean;
				mediation?: 'optional' | 'required' | 'silent';
			} = {},
		): Promise<{ success: boolean; error?: Error }> => {
			try {
				setOfflineState((prev) => ({ ...prev, error: null }));

				if (currentIsOnline) {
					// Online: Use regular auth flow
					const { data, error } = await tryCatch(
						signIn.social({
							callbackURL: '/',
							provider: 'google',
						}),
					);

					if (error) {
						return { error, success: false };
					}

					// Store credentials after successful login
					if (data) {
						await handleGoogleSignInSuccess(data);
					}

					return { success: true };
				} else {
					// Offline: Try to use stored credentials
					if (!options.force && !offlineState.hasOfflineCredentials) {
						return {
							error: new Error('No offline credentials available'),
							success: false,
						};
					}

					const { credential, error } =
						await federatedCredentialManager.getCredentials({
							mediation: options.mediation || 'optional',
						});

					if (error || !credential) {
						return {
							error: error || new Error('No credentials found'),
							success: false,
						};
					}

					// Note: In a real app, you'd validate the offline credential
					// For now, we'll assume it's valid and update the state
					setOfflineState((prev) => ({
						...prev,
						error: null,
						lastSyncTime: Date.now(),
					}));

					return { success: true };
				}
			} catch (error) {
				const authError =
					error instanceof Error ? error : new Error('Login failed');
				setOfflineState((prev) => ({ ...prev, error: authError }));
				return { error: authError, success: false };
			}
		},
		[
			currentIsOnline,
			offlineState.hasOfflineCredentials,
			handleGoogleSignInSuccess,
		],
	);

	// Logout function
	const logout = useCallback(async (): Promise<{
		success: boolean;
		error?: Error;
	}> => {
		try {
			setOfflineState((prev) => ({ ...prev, error: null }));

			if (currentIsOnline) {
				const { error } = await tryCatch(signOut());
				if (error) {
					return { error, success: false };
				}
			}

			// Clear offline credentials
			const { error: clearError } = await tryCatch(
				federatedCredentialManager.clearCredentials(),
			);

			if (clearError) {
				console.warn('Failed to clear offline credentials:', clearError);
			}

			setOfflineState({
				error: null,
				hasOfflineCredentials: false,
				lastSyncTime: null,
			});

			return { success: true };
		} catch (error) {
			const authError =
				error instanceof Error ? error : new Error('Logout failed');
			setOfflineState((prev) => ({ ...prev, error: authError }));
			return { error: authError, success: false };
		}
	}, [currentIsOnline]);

	// Sync credentials when coming back online
	const syncCredentials = useCallback(async (): Promise<{
		success: boolean;
		error?: Error;
	}> => {
		if (!currentIsOnline) {
			return {
				error: new Error('Cannot sync while offline'),
				success: false,
			};
		}

		try {
			setOfflineState((prev) => ({ ...prev, error: null }));

			// Get stored credentials
			const { credential, error: getError } =
				await federatedCredentialManager.getCredentials({
					mediation: 'silent',
				});

			if (getError || !credential) {
				return {
					error: getError || new Error('No credentials to sync'),
					success: false,
				};
			}

			// Validate credentials with server
			// In a real app, you'd make an API call to validate the stored token
			setOfflineState((prev) => ({
				...prev,
				error: null,
				lastSyncTime: Date.now(),
			}));

			return { success: true };
		} catch (error) {
			const syncError =
				error instanceof Error ? error : new Error('Sync failed');
			setOfflineState((prev) => ({ ...prev, error: syncError }));
			return { error: syncError, success: false };
		}
	}, [currentIsOnline]);

	// Clear offline credentials
	const clearOfflineCredentials = useCallback(async (): Promise<{
		success: boolean;
		error?: Error;
	}> => {
		const { success, error } =
			await federatedCredentialManager.clearCredentials();

		if (success) {
			setOfflineState({
				error: null,
				hasOfflineCredentials: false,
				lastSyncTime: null,
			});
		}

		return { error, success };
	}, []);

	// Auto-sync when coming back online
	useEffect(() => {
		if (
			currentIsOnline &&
			offlineState.hasOfflineCredentials &&
			!session.data
		) {
			syncCredentials();
		}
	}, [
		currentIsOnline,
		offlineState.hasOfflineCredentials,
		session.data,
		syncCredentials,
	]);

	return {
		clearOfflineCredentials,
		error: session.error || offlineState.error,
		hasOfflineCredentials: offlineState.hasOfflineCredentials,
		isAuthenticated: !!session.data?.user && !session.data.user.isAnonymous,
		isLoading: session.isPending,
		isOnline: currentIsOnline,
		lastSyncTime: offlineState.lastSyncTime,

		// Actions
		login,
		logout,
		session: session.data || null,
		syncCredentials,
		// State
		user: session.data?.user || null,
	};
}
