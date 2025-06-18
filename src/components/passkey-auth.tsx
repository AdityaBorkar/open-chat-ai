'use client';

import { useState } from 'react';

import { authClient } from '@/lib/auth/client';

export function PasskeyAuth() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleAddPasskey = async () => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response = await authClient.passkey.addPasskey();

			if (response?.error) {
				setError(response.error.message || 'Failed to add passkey');
			} else {
				setSuccess('Passkey added successfully!');
			}
		} catch (err) {
			setError('An unexpected error occurred');
			console.error('Passkey registration error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignInWithPasskey = async () => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response = await authClient.signIn.passkey();

			if (response?.error) {
				setError(response.error.message || 'Failed to sign in with passkey');
			} else {
				setSuccess('Signed in successfully with passkey!');
			}
		} catch (err) {
			setError('An unexpected error occurred');
			console.error('Passkey signin error:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignInWithConditionalUI = async () => {
		try {
			// Check if conditional UI is supported
			if (
				!window.PublicKeyCredential?.isConditionalMediationAvailable ||
				!(await window.PublicKeyCredential.isConditionalMediationAvailable())
			) {
				setError('Conditional UI not supported in this browser');
				return;
			}

			// Start conditional UI authentication
			await authClient.signIn.passkey({ autoFill: true });
		} catch (err) {
			console.error('Conditional UI error:', err);
			// Don't show error for conditional UI as it's meant to be passive
		}
	};

	return (
		<div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
			<h2 className="font-bold text-2xl text-gray-900">
				Passkey Authentication
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

			<div className="space-y-3">
				<button
					className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isLoading}
					onClick={handleAddPasskey}
					type="button"
				>
					{isLoading ? 'Adding...' : 'Add Passkey'}
				</button>

				<button
					className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isLoading}
					onClick={handleSignInWithPasskey}
					type="button"
				>
					{isLoading ? 'Signing in...' : 'Sign in with Passkey'}
				</button>

				<button
					className="w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={isLoading}
					onClick={handleSignInWithConditionalUI}
					type="button"
				>
					Enable Conditional UI
				</button>
			</div>
		</div>
	);
}
