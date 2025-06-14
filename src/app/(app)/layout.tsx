'use client';

import { Link } from '@/components/ui/Link';
import { signIn, useSession } from '@/lib/auth-client';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const auth = useSession();
	const database = { isPending: false };
	// const database = useDatabase({ userId: auth.data?.user.id });

	console.log('auth', auth.isPending, auth.data);
	if (auth.isPending || database.isPending) return <div>Loading...</div>;
	if (auth.data === null) {
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

	// if (database.error)
	// 	return (
	// 		<div>
	// 			<div>
	// 				Could not not verify user. This is unusual and not expected. We have
	// 				reported the issue and shall fix it soon.
	// 			</div>
	// 			<button type="button">Logout</button>
	// 		</div>
	// 	);

	return (
		<div>
			{/* {children} */}
			OK
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
