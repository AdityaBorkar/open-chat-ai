import Script from 'next/script';

export default function OfflineScript() {
	return (
		// 		{/* <OfflineBanner /> */}
		// {/* <ServiceWorkerInit /> */}
		<Script
			dangerouslySetInnerHTML={{
				__html: `
					if ('serviceWorker' in navigator) {
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
		/>
	);
}
