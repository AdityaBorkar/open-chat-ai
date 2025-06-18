'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/useAuth';

export function CredentialManagement() {
	const {
		isOnline,
		hasOfflineCredentials,
		lastSyncTime,
		syncCredentials,
		clearOfflineCredentials,
		error,
	} = useAuth();

	const [isOperating, setIsOperating] = useState(false);
	const [operationResult, setOperationResult] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	const handleSync = async () => {
		setIsOperating(true);
		setOperationResult(null);

		const { success, error } = await syncCredentials();

		setOperationResult({
			message: success
				? 'Credentials synced successfully'
				: error?.message || 'Sync failed',
			type: success ? 'success' : 'error',
		});

		setIsOperating(false);
	};

	const handleClearCredentials = async () => {
		if (!confirm('Are you sure you want to clear all offline credentials?')) {
			return;
		}

		setIsOperating(true);
		setOperationResult(null);

		const { success, error } = await clearOfflineCredentials();

		setOperationResult({
			message: success
				? 'Offline credentials cleared'
				: error?.message || 'Clear failed',
			type: success ? 'success' : 'error',
		});

		setIsOperating(false);
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="font-semibold text-lg">Credential Management</h3>
				<p className="text-muted-foreground text-sm">
					Manage your offline authentication credentials and sync status.
				</p>
			</div>

			{/* Status Information */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="rounded-lg border p-4">
					<div className="flex items-center gap-2">
						<div
							className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
						/>
						<span className="font-medium">
							{isOnline ? 'Online' : 'Offline'}
						</span>
					</div>
					<p className="mt-1 text-muted-foreground text-sm">
						{isOnline ? 'Connected to server' : 'Using offline mode'}
					</p>
				</div>

				<div className="rounded-lg border p-4">
					<div className="flex items-center gap-2">
						<div
							className={`h-3 w-3 rounded-full ${hasOfflineCredentials ? 'bg-green-500' : 'bg-gray-400'}`}
						/>
						<span className="font-medium">
							{hasOfflineCredentials ? 'Credentials Stored' : 'No Credentials'}
						</span>
					</div>
					<p className="mt-1 text-muted-foreground text-sm">
						{hasOfflineCredentials
							? 'Offline authentication available'
							: 'Sign in to store credentials'}
					</p>
				</div>
			</div>

			{/* Last Sync Time */}
			{lastSyncTime && (
				<div className="rounded-lg border p-4">
					<span className="font-medium">Last Sync:</span>
					<p className="mt-1 text-muted-foreground text-sm">
						{new Date(lastSyncTime).toLocaleString()}
					</p>
				</div>
			)}

			{/* Operation Result */}
			{operationResult && (
				<div
					className={`rounded-lg p-4 ${
						operationResult.type === 'success'
							? 'bg-green-50 text-green-700'
							: 'bg-red-50 text-red-700'
					}`}
				>
					{operationResult.message}
				</div>
			)}

			{/* Error Display */}
			{error && (
				<div className="rounded-lg bg-red-50 p-4 text-red-700">
					<strong>Error:</strong> {error.message}
				</div>
			)}

			{/* Actions */}
			<div className="flex flex-col gap-3 sm:flex-row">
				<Button
					disabled={!isOnline || !hasOfflineCredentials || isOperating}
					onClick={handleSync}
				>
					{isOperating ? 'Syncing...' : 'Sync Credentials'}
				</Button>

				<Button
					disabled={!hasOfflineCredentials || isOperating}
					onClick={handleClearCredentials}
					variant="destructive"
				>
					{isOperating ? 'Clearing...' : 'Clear Offline Credentials'}
				</Button>
			</div>

			{/* Help Text */}
			<div className="rounded-lg bg-blue-50 p-4 text-sm">
				<h4 className="font-medium text-blue-900">How it works:</h4>
				<ul className="mt-2 list-disc space-y-1 pl-5 text-blue-800">
					<li>Your credentials are stored locally using secure browser APIs</li>
					<li>When offline, you can still sign in using stored credentials</li>
					<li>
						Sync ensures your credentials are up-to-date when you're online
					</li>
					<li>
						Clear credentials to remove all locally stored authentication data
					</li>
				</ul>
			</div>
		</div>
	);
}
