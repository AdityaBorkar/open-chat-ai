// import { fileURLToPath } from 'node:url';
// import { createJiti } from 'jiti';
import type { NextConfig } from 'next';

// const jiti = createJiti(fileURLToPath(import.meta.url));

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
// jiti('./app/env');

const nextConfig: NextConfig = {
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
				],
				source: '/(.*)',
			},
		];
	},
	serverExternalPackages: ['@electric-sql/pglite'],
};

export default nextConfig;
