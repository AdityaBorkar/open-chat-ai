import type { MetadataRoute } from 'next';

import { APP } from '@/lib/constants';

export default function manifest(): MetadataRoute.Manifest {
	return {
		background_color: APP.color.bg,
		categories: ['productivity', 'utilities'],
		description: APP.description,
		display: 'standalone',
		display_override: ['window-controls-overlay'],
		file_handlers: [
			{
				accept: {
					'application/json': ['.json'],
				},
				action: '/',
			},
		],
		icons: [
			{
				sizes: '192x192',
				src: APP.icon[192],
				type: 'image/png',
			},
		],
		id: APP.domain,
		lang: 'en',
		launch_handler: {
			client_mode: 'focus-existing',
		},
		name: APP.name,
		orientation: 'portrait-primary',
		prefer_related_applications: false,
		protocol_handlers: [
			{
				protocol: 'tg',
				url: '/',
			},
		],
		related_applications: [],
		scope: '/',
		screenshots: [
			{
				form_factor: 'wide',
				sizes: '1280x720',
				src: '/screenshots/wide.png',
				type: 'image/png',
			},
			{
				form_factor: 'narrow',
				sizes: '750x1334',
				src: '/screenshots/narrow.png',
				type: 'image/png',
			},
		],
		// share_target: {
		// 	action: '/',
		// 	method: 'GET',
		// 	params: {
		// 		files: ['image/*'],
		// 	},
		// },
		short_name: APP.name,
		shortcuts: [
			{
				description: 'Start a new conversation',
				icons: [
					{
						sizes: '192x192',
						src: '/icons/192.png',
					},
				],
				name: 'New Chat',
				short_name: 'New Chat',
				url: '/',
			},
			{
				description: 'Open app settings',
				icons: [
					{
						sizes: '192x192',
						src: '/icons/192.png',
					},
				],
				name: 'Settings',
				short_name: 'Settings',
				url: '/settings',
			},
		],
		start_url: '/',
		theme_color: APP.color.theme,
	};
}
