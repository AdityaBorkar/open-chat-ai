'use client';

import { useEffect, useState } from 'react';

import { authClient } from '@/lib/auth-client';

export function AuthShowcase() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { data: session } = authClient.useSession();

	// Initialize One Tap on component mount
	useEffect(() => {
		const initOneTap = async () => {
			try {
				// Check if conditional UI is supported
				if (
					window.PublicKeyCredential?.isConditionalMediationAvailable &&
					(await window.PublicKeyCredential.isConditionalMediationAvailable())
				) {
					await authClient.signIn.passkey({ autoFill: true });
				}

				// Initialize Google One Tap
				await authClient.oneTap({
					fetchOptions: {
						onSuccess: () => {
							setSuccess('Signed in with Google One Tap!');
						},
					},
					onPromptNotification: (notification) => {
						console.log('One Tap prompt notification:', notification);
					},
				});
			} catch (err) {
				console.log('One Tap initialization failed:', err);
			}
		};

		if (!session) {
			initOneTap();
		}
	}, [session]);

	const handleAnonymousSignIn = async () => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response = await authClient.signIn.anonymous();
			if (response?.error) {
				setError(response.error.message || 'Failed to sign in anonymously');
			} else {
				setSuccess('Signed in anonymously! You can browse as a guest.');
			}
		} catch (err) {
			setError('An unexpected error occurred');
			console.error('Anonymous signin error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response = await authClient.signIn.email({
				email,
				password,
			});

			if (response?.error) {
				setError(response.error.message || 'Failed to sign in');
			} else {
				setSuccess('Signed in successfully!');
			}
		} catch (err) {
			setError('An unexpected error occurred');
			console.error('Email signin error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await authClient.signIn.social({
				callbackURL: '/dashboard',
				provider: 'google',
			});
		} catch (err) {
			setError('An unexpected error occurred');
			console.error('Google signin error:', err);
			setIsLoading(false);
		}
	};

	const handleGitHubSignIn = async () => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await authClient.signIn.social({
				callbackURL: '/dashboard',
				provider: 'github',
			});
		} catch (err) {
			setError('An unexpected error occurred');
			console.error('GitHub signin error:', err);
			setIsLoading(false);
		}
	};

	const handleSignOut = async () => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			await authClient.signOut();
			setSuccess('Signed out successfully');
		} catch (err) {
			setError('Failed to sign out');
			console.error('Sign out error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	if (session) {
		return (
			<div className="mx-auto max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
				<h2 className="text-center font-bold text-2xl text-gray-900">
					Welcome!
				</h2>

				<div className="space-y-2 text-center">
					<p className="text-lg">Hello, {session.user.name}!</p>
					<p className="text-gray-600 text-sm">{session.user.email}</p>
					{session.user.isAnonymous && (
						<p className="rounded bg-blue-50 p-2 text-blue-600 text-sm">
							👤 You're signed in anonymously
						</p>
					)}
				</div>

				{error && (
					<div className="rounded border border-red-300 bg-red-100 p-3 text-red-700">
						{error}
					</div>
				)}

				{success && (
					<div className="rounded border border-green-300 bg-green-100 p-3 text-green-700">
						{success}
					</div>
				)}

				<button
					className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isLoading}
					onClick={handleSignOut}
					type="button"
				>
					{isLoading ? 'Signing out...' : 'Sign Out'}
				</button>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
			<h2 className="text-center font-bold text-2xl text-gray-900">
				T3 Chat Authentication
			</h2>

			{error && (
				<div className="rounded border border-red-300 bg-red-100 p-3 text-red-700">
					{error}
				</div>
			)}

			{success && (
				<div className="rounded border border-green-300 bg-green-100 p-3 text-green-700">
					{success}
				</div>
			)}

			{/* Anonymous Sign In */}
			<div className="space-y-3">
				<h3 className="font-semibold text-gray-800">🚀 Quick Start</h3>
				<button
					className="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isLoading}
					onClick={handleAnonymousSignIn}
					type="button"
				>
					{isLoading ? 'Signing in...' : '👤 Continue as Guest'}
				</button>
				<p className="text-center text-gray-500 text-xs">
					No registration required. You can link your account later.
				</p>
			</div>

			<div className="border-t pt-4">
				<h3 className="mb-3 font-semibold text-gray-800">🔐 Sign In Methods</h3>

				{/* Email/Password Form */}
				<form className="mb-4 space-y-3" onSubmit={handleEmailSignIn}>
					<input
						autoComplete="email webauthn"
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						required
						type="email"
						value={email}
					/>
					<input
						autoComplete="current-password webauthn"
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						required
						type="password"
						value={password}
					/>
					<button
						className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isLoading}
						type="submit"
					>
						{isLoading ? 'Signing in...' : '📧 Sign In with Email'}
					</button>
				</form>

				{/* Social Sign In */}
				<div className="space-y-2">
					<button
						className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isLoading}
						onClick={handleGoogleSignIn}
						type="button"
					>
						{isLoading ? 'Redirecting...' : '🔍 Sign In with Google'}
					</button>

					<button
						className="w-full rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isLoading}
						onClick={handleGitHubSignIn}
						type="button"
					>
						{isLoading ? 'Redirecting...' : '🐙 Sign In with GitHub'}
					</button>
				</div>
			</div>

			<div className="space-y-1 text-gray-500 text-xs">
				<p>
					<strong>🛡️ Security Features:</strong>
				</p>
				<ul className="list-inside list-disc space-y-1">
					<li>✅ hCaptcha bot protection</li>
					<li>✅ Google One Tap (auto-appears)</li>
					<li>✅ Passkey support (WebAuthn)</li>
					<li>✅ Anonymous browsing</li>
					<li>✅ Account linking</li>
				</ul>
			</div>
		</div>
	);
}
