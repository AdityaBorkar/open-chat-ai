'use client';

// import { useState, useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const auth = useAuth();
	const database = useDatabase();

	if (auth.isLoading || database.isLoading) return <div>Loading...</div>;

	if (auth.error) return <div>Error</div>;

	if (database.error) return <div>Error</div>;

	return (
		<div>
			{children}

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
