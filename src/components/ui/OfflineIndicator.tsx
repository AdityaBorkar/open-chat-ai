'use client';

import { useEffect, useState } from 'react';
import { TbCloudBolt, TbCloudOff, TbWifi, TbWifiOff } from 'react-icons/tb';

import { type OfflineStatus, swManager } from '@/lib/service-worker';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
	className?: string;
	showText?: boolean;
	variant?: 'compact' | 'detailed';
}

export function OfflineIndicator({
	className,
	showText = true,
	variant = 'compact',
}: OfflineIndicatorProps) {
	const [status, setStatus] = useState<OfflineStatus>({
		isOnline: true,
		pendingSync: 0,
	});
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const updateStatus = async () => {
			const currentStatus = await swManager.getOfflineStatus();
			setStatus(currentStatus);
			setIsVisible(!currentStatus.isOnline || currentStatus.pendingSync > 0);
		};

		const handleOnlineStatus = (isOnline: boolean) => {
			setStatus((prev) => ({ ...prev, isOnline }));
			setIsVisible(!isOnline || status.pendingSync > 0);

			if (isOnline && status.pendingSync > 0) {
				// Trigger sync when coming back online
				swManager.forceSync();
			}
		};

		// Initial status check
		updateStatus();

		// Listen for online/offline events
		window.addEventListener('online', () => handleOnlineStatus(true));
		window.addEventListener('offline', () => handleOnlineStatus(false));

		// Listen for service worker messages
		swManager.on('SYNC_SUCCESS', () => {
			updateStatus();
		});

		swManager.on('MESSAGE_QUEUED', () => {
			updateStatus();
		});

		swManager.on('SYNC_FAILED', () => {
			updateStatus();
		});

		// Periodic status updates
		const interval = setInterval(updateStatus, 10_000); // Every 10 seconds

		const cleanup = () => {
			window.removeEventListener('online', () => handleOnlineStatus(true));
			window.removeEventListener('offline', () => handleOnlineStatus(false));
			clearInterval(interval);
		};

		return cleanup;
	}, [status.pendingSync]);

	if (!isVisible) {
		return null;
	}

	const getIcon = () => {
		if (!status.isOnline) {
			return <TbWifiOff className="size-4" />;
		}
		if (status.pendingSync > 0) {
			return <TbCloudBolt className="size-4 animate-spin" />;
		}
		return <TbWifi className="size-4" />;
	};

	const getStatusText = () => {
		if (!status.isOnline) {
			if (status.pendingSync > 0) {
				return `Offline • ${status.pendingSync} pending`;
			}
			return 'Offline';
		}
		if (status.pendingSync > 0) {
			return `Syncing ${status.pendingSync} message${status.pendingSync > 1 ? 's' : ''}...`;
		}
		return 'Online';
	};

	const getStatusColor = () => {
		if (!status.isOnline) {
			return 'bg-red-500/20 text-red-300 border-red-500/30';
		}
		if (status.pendingSync > 0) {
			return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
		}
		return 'bg-green-500/20 text-green-300 border-green-500/30';
	};

	if (variant === 'detailed') {
		return (
			<div
				className={cn(
					'flex items-center gap-3 rounded-lg border px-3 py-2 text-sm',
					getStatusColor(),
					className,
				)}
			>
				{getIcon()}
				<div className="flex flex-col">
					<span className="font-medium">{getStatusText()}</span>
					{status.lastSync && (
						<span className="text-xs opacity-70">
							Last sync: {new Date(status.lastSync).toLocaleTimeString()}
						</span>
					)}
				</div>
				{status.pendingSync > 0 && (
					<button
						className="rounded px-2 py-1 text-xs hover:bg-white/10"
						onClick={() => swManager.forceSync()}
						type="button"
					>
						Retry
					</button>
				)}
			</div>
		);
	}

	return (
		<div
			className={cn(
				'flex items-center gap-2 rounded-full border px-3 py-1 text-sm',
				getStatusColor(),
				className,
			)}
		>
			{getIcon()}
			{showText && <span>{getStatusText()}</span>}
		</div>
	);
}

// Floating offline banner
export function OfflineBanner() {
	const [isOffline, setIsOffline] = useState(false);
	const [pendingCount, setPendingCount] = useState(0);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const updateStatus = async () => {
			const status = await swManager.getOfflineStatus();
			setIsOffline(!status.isOnline);
			setPendingCount(status.pendingSync);
			setIsVisible(!status.isOnline || status.pendingSync > 0);
		};

		updateStatus();

		const handleOnline = () => {
			setIsOffline(false);
			updateStatus();
		};

		const handleOffline = () => {
			setIsOffline(true);
			setIsVisible(true);
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		swManager.on('*', updateStatus);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	if (!isVisible) {
		return null;
	}

	return (
		<div className="fixed top-4 right-4 z-50 max-w-sm">
			<div
				className={cn(
					'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm',
					isOffline
						? 'border-red-500/30 bg-red-500/20 text-red-100'
						: 'border-yellow-500/30 bg-yellow-500/20 text-yellow-100',
				)}
			>
				{isOffline ? (
					<TbCloudOff className="size-5 flex-shrink-0" />
				) : (
					<TbCloudBolt className="size-5 flex-shrink-0 animate-spin" />
				)}

				<div className="flex-1">
					{isOffline ? (
						<div>
							<div className="font-medium">You are offline</div>
							{pendingCount > 0 && (
								<div className="text-sm opacity-90">
									{pendingCount} message{pendingCount > 1 ? 's' : ''} will sync
									when online
								</div>
							)}
						</div>
					) : (
						<div>
							<div className="font-medium">Syncing messages...</div>
							<div className="text-sm opacity-90">{pendingCount} remaining</div>
						</div>
					)}
				</div>

				<button
					className="flex-shrink-0 rounded p-1 hover:bg-white/10"
					onClick={() => setIsVisible(false)}
					type="button"
				>
					*
				</button>
			</div>
		</div>
	);
}

// Status dot for minimal UI
export function OfflineStatusDot({ className }: { className?: string }) {
	const [isOnline, setIsOnline] = useState(true);
	const [hasPending, setHasPending] = useState(false);

	useEffect(() => {
		const updateStatus = async () => {
			const status = await swManager.getOfflineStatus();
			setIsOnline(status.isOnline);
			setHasPending(status.pendingSync > 0);
		};

		updateStatus();

		window.addEventListener('online', () => setIsOnline(true));
		window.addEventListener('offline', () => setIsOnline(false));

		swManager.on('*', updateStatus);

		const interval = setInterval(updateStatus, 5000);

		return () => {
			window.removeEventListener('online', () => setIsOnline(true));
			window.removeEventListener('offline', () => setIsOnline(false));
			clearInterval(interval);
		};
	}, []);

	const getColor = () => {
		if (!isOnline) {
			return 'bg-red-500';
		}
		if (hasPending) {
			return 'bg-yellow-500 animate-pulse';
		}
		return 'bg-green-500';
	};

	return <div className={cn('size-2 rounded-full', getColor(), className)} />;
}
