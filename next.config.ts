import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: '/(.*)',
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
			},
		];
	},
};

export default nextConfig;
