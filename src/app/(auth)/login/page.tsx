'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import { useAuth } from '@/lib/auth/useAuth';

export default function LoginPage() {
	const {
		isAuthenticated,
		isLoading,
		isOnline,
		hasOfflineCredentials,
		login,
		error,
	} = useAuth();

	const [isSigningIn, setIsSigningIn] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);

	// Redirect if already authenticated
	if (isAuthenticated) redirect('/');

	// Auto-login with stored credentials
	useEffect(() => {
		if (!isAuthenticated && hasOfflineCredentials && !isOnline) {
			handleAutoLogin();
		}

		async function handleAutoLogin() {
			const { success, error } = await login({ mediation: 'silent' });
			if (!success && error) {
				console.log('Auto-login failed:', error.message);
			}
		}
	}, [isAuthenticated, hasOfflineCredentials, isOnline, login]);

	const handleGoogleSignIn = async () => {
		setIsSigningIn(true);
		setAuthError(null);

		const { success, error } = await login();

		if (!success && error) {
			setAuthError(error.message);
		}

		setIsSigningIn(false);
	};

	const handleOfflineLogin = async () => {
		setIsSigningIn(true);
		setAuthError(null);

		const { success, error } = await login({ force: true });

		if (!success && error) {
			setAuthError(error.message);
		}

		setIsSigningIn(false);
	};

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="mx-auto flex w-md flex-col gap-4 rounded-xl border border-border/20 px-6 py-4">
				<div className="mb-6 text-center font-semibold text-xl">Login</div>

				{/* Online Status Indicator */}
				<div className="flex items-center justify-center gap-2 text-sm">
					<div
						className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
					/>
					<span className="text-muted-foreground">
						{isOnline ? 'Online' : 'Offline'}
					</span>
				</div>

				{/* Error Display */}
				{(authError || error) && (
					<div className="rounded-md bg-red-50 p-3 text-red-700 text-sm">
						{authError || error?.message}
					</div>
				)}

				{/* Google Sign In Button */}
				<Button
					disabled={isSigningIn || isLoading}
					onClick={handleGoogleSignIn}
				>
					{isSigningIn ? 'Signing in...' : 'Sign in with Google'}
				</Button>

				{/* Offline Login Button */}
				{!isOnline && hasOfflineCredentials && (
					<Button
						disabled={isSigningIn || isLoading}
						onClick={handleOfflineLogin}
						variant="shadow"
					>
						{isSigningIn ? 'Signing in...' : 'Use Offline Credentials'}
					</Button>
				)}

				{/* Guest Option */}
				<Link href="/">Continue as Guest</Link>

				{/* Offline Credentials Info */}
				{hasOfflineCredentials && (
					<div className="mt-4 text-center text-muted-foreground text-xs">
						✓ Offline credentials available
					</div>
				)}
			</div>
		</div>
	);
}
