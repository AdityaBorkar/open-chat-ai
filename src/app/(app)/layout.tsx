'use client';

import Background from '@/components/Background';
import ShortcutGuide from '@/components/ShortcutGuide';
import { signIn } from '@/lib/auth/client';
import { useAuth } from '@/lib/auth/useAuth';
import { useDatabase } from '@/lib/db/client';

export default function NonOfflineLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const {
		user,
		isLoading: authLoading,
		isOnline,
		hasOfflineCredentials,
		error: authError,
	} = useAuth();

	const database = useDatabase({ userId: user?.id });

	// Show loading state while initializing
	if (authLoading || database.isPending) {
		return (
			<Bg>
				<div className="flex flex-col items-center gap-4">
					<div>Loading...</div>
					{!isOnline && (
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<div className="h-2 w-2 rounded-full bg-red-500" />
							<span>Offline Mode</span>
						</div>
					)}
				</div>
			</Bg>
		);
	}

	// Show error state
	if (authError || database.error) {
		console.error('Auth Error:', authError);
		console.error('Database Error:', database.error);
		return (
			<Bg>
				<div className="flex flex-col items-center gap-4">
					<div>Trouble loading the app. This must be fixed soon.</div>
					{!isOnline && hasOfflineCredentials && (
						<div className="text-muted-foreground text-sm">
							Offline credentials available - try refreshing
						</div>
					)}
				</div>
			</Bg>
		);
	}

	// Handle anonymous users (only if online or no offline credentials)
	if (!user && (isOnline || !hasOfflineCredentials)) {
		console.log('Signing in as Anonymous...');
		signIn.anonymous();
		return (
			<Bg>
				<div className="flex flex-col items-center gap-4">
					<div>Signing in as Anonymous...</div>
					{!isOnline && (
						<div className="text-muted-foreground text-sm">
							Running in offline mode
						</div>
					)}
				</div>
			</Bg>
		);
	}

	return (
		<div>
			{children}
			<ShortcutGuide />
		</div>
	);
}

function Bg({ children }: { children: React.ReactNode }) {
	return (
		<Background>
			<div className="flex h-screen flex-col items-center justify-center">
				{children}
			</div>
		</Background>
	);
}
