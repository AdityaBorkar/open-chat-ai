// import { fileURLToPath } from 'node:url';
// import { createJiti } from 'jiti';
import type { NextConfig } from 'next';

// const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
// jiti('./app/env');

const nextConfig: NextConfig = {
	devIndicators: false,
	async headers() {
		return [
			{
				headers: [
					{
						key: 'Accept-CH',
						value: 'Sec-CH-Prefers-Color-Scheme',
					},
					{
						key: 'Critical-CH',
						value: 'Sec-CH-Prefers-Color-Scheme',
					},
					{
						key: 'Cross-Origin-Embedder-Policy',
						value: 'require-corp',
					},
					{
						key: 'Cross-Origin-Opener-Policy',
						value: 'same-origin',
					},
				],
				source: '/(.*)',
			},
		];
	},
	serverExternalPackages: ['@electric-sql/pglite'],
	webpack: (config, { isServer, dev }) => {
		if (!isServer) {
			// Handle worker files properly
			config.output.globalObject = 'self';

			// Resolve worker imports
			config.resolve.fallback = {
				...config.resolve.fallback,
				crypto: false,
				fs: false,
				path: false,
			};
		}

		return config;
	},
};

export default nextConfig;
