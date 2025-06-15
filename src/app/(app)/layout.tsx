'use client';

import { Link } from '@/components/ui/Link';
import { signIn, signOut, useSession } from '@/lib/auth/client';
import { useDatabase } from '@/lib/db/client';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const auth = useSession();
	const database = useDatabase({ userId: auth.data?.user.id });

	if (auth.isPending) return <div>Loading...</div>;
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
				{/*  */}
			</div>
		);

	return (
		<div>
			{/* {children} */}
			NOT-OK
			<button onClick={() => signOut()} type="button">
				Logout
			</button>
			{/* <div className="fixed top-0 left-0 h-screen w-screen bg-bg-primary/50 backdrop-blur-sm">
				Shortcuts

				Customize Send / Draft Send / Multiline

				Onboard as a Power User
				Onboard as a Simple User
			</div> */}
			{/* <Script
				dangerouslySetInnerHTML={{
					__html: `
								if ('serviceWorker' in navigator) {
								window.addEventListener('load', async () => {
									try {
									await navigator.serviceWorker.register('/sw.js');
									console.log('SW registered');
									} catch (error) {
									console.log('SW registration failed');
									}
								});
								}
							`,
				}}
				id="sw-init"
				strategy="afterInteractive"
			/> */}
			{/* <OfflineBanner /> */}
			{/* <ServiceWorkerInit /> */}
		</div>
	);
}
