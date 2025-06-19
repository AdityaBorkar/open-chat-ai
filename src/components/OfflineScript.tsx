import Script from 'next/script';

export default function OfflineScript() {
	return <Script src="/sw-loader.js" strategy="afterInteractive" />;
}
