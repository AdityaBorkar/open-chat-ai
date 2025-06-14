import type { NextConfig } from 'next';

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
};

export default nextConfig;
