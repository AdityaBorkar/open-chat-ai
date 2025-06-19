'use client';

import Background from '@/components/Background';
import ShortcutGuide from '@/components/ShortcutGuide';
import { useSession } from '@/lib/auth/client';
import { useDatabase } from '@/lib/db/client';

export default function NonOfflineLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { session } = useSession();
	const database = useDatabase();

	// Show loading state while initializing
	if (session.isPending || database.isPending) {
		return <Bg>Loading...</Bg>;
	}

	// Show error state
	if (session.error || database.error) {
		return <Bg>Trouble loading the app. This must be fixed soon.</Bg>;
	}

	// TODO: Avoid this one to prevent abuse and EU Rules.
	// TODO: Do not sign in, just use offline-only mode
	// Handle anonymous users (only if online or no offline credentials)
	// if (!session.data?.user) {
	// 	console.log('Signing in as Anonymous...');
	// 	signIn.anonymous();
	// 	return (
	// 		<Bg>
	// 			<div className="flex flex-col items-center gap-4">
	// 				<div>Signing in as Anonymous...</div>
	// 			</div>
	// 		</Bg>
	// 	);
	// }

	if (!session.data?.user || session.data?.user.isAnonymous) {
		return (
			<Bg>You are not authenticated. Guest access is currently disabled.</Bg>
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
