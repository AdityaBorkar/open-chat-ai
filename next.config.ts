// import MillionLint from '@million/lint';
// import { fileURLToPath } from 'node:url';
// import createJiti from 'jiti';
import type { NextConfig } from 'next';

// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
// const jiti = createJiti(fileURLToPath(import.meta.url));
// jiti('./env');

const nextConfig: NextConfig = {
	devIndicators: false,
	experimental: {
		reactCompiler: true,
	},
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
					// {
					// 	key: 'Cross-Origin-Embedder-Policy',
					// 	value: 'require-corp',
					// },
					// {
					// 	key: 'Cross-Origin-Opener-Policy',
					// 	value: 'same-origin',
					// },
				],

				source: '/(.*)',
			},
		];
	},
	transpilePackages: ['@electric-sql/pglite-react', '@electric-sql/pglite'],
};

export default nextConfig;

// export default MillionLint.next({
// 	enabled: true,
// 	experimental: {
// 		stabilize: true,
// 	},
// 	rsc: true,
// })(nextConfig);
