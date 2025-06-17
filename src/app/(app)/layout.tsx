'use client';

import ShortcutGuide from '@/components/ShortcutGuide';
import { Link } from '@/components/ui/Link';
import { signIn, useSession } from '@/lib/auth/client';
import { useDatabase } from '@/lib/db/client';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const auth = useSession();
	const database = useDatabase({ userId: 'auth.data?.user.id' });

	if (auth.isPending) return <div>Auth Loading...</div>;
	if (auth.data === null) {
		// ! POSSIBLE INFINITE LOOP
		console.log('Signing in as Anonymous...');
		signIn.anonymous();
		return <div>Signing in as Anonymous...</div>;
	}
	if (auth.error)
		return (
			<div>
				<div>
					Could not not verify user. This is unusual and not expected. We have
					reported the issue and shall fix it soon.
				</div>
				<Link href="/login?force=true">Go to Login</Link>
			</div>
		);

	if (database.isPending) return <div>DB Loading...</div>;
	if (database.error)
		return (
			<div>
				<div>
					Could not not connect to database. This is unusual and not expected.
					We have reported the issue and shall fix it soon.
				</div>
			</div>
		);

	return (
		<div>
			{children}
			{/* <OfflineScript /> */}
			<ShortcutGuide />
		</div>
	);
}
