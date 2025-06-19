import { headers } from 'next/headers';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/**
 * Get theme CSS class for server-side rendering
 */
export async function getThemeClass(): Promise<string> {
	const headersList = await headers();
	const colorSchemeHint = headersList.get('sec-ch-prefers-color-scheme');

	// Client hint values: 'dark', 'light', or null
	if (colorSchemeHint === 'light') {
		return 'light';
	}

	// Default to dark if no hint or hint is 'dark'
	return 'dark';
}

/**
 * Generate theme script for preventing flash of wrong theme
 * This script runs before React hydration
 */
export function getThemeScript(): string {
	return `
		(function() {
			function getTheme() {
				const stored = localStorage.getItem('theme');
				if (stored && stored !== 'system') return stored;
				return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			}

			const theme = getTheme();
			document.documentElement.classList.remove('light', 'dark');
			document.documentElement.classList.add(theme);
		})()
	`;
}
