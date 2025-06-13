// biome-ignore assist/source/organizeImports: ReactScan must be imported before anything else
import { ReactScan } from '@/components/ReactScan';
import type { Metadata } from 'next';
import { Figtree, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { getThemeClass } from '@/lib/theme-utils';
import { cn } from '@/lib/utils';

import './globals.css';
import Script from 'next/script';

const fontSans = Figtree({
	subsets: ['latin'],
	variable: '--font-font-sans',
});

const fontMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-font-mono',
});

export const metadata: Metadata = {
	description: 'Open Source AI Chat with local database storage',
	title: '[NAME] - Open Source AI Chat',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const themeClass = await getThemeClass();
	const flags = { reactScan: true };
	return (
		<ThemeProvider>
			<html className={themeClass} lang="en">
				{flags.reactScan && <ReactScan />}
				<body
					className={cn(
						fontSans.variable,
						fontMono.variable,
						'dark min-h-screen bg-background text-base text-foreground antialiased',
					)}
				>
					<Script id="theme-script" strategy="beforeInteractive">
						{`
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
			`}
					</Script>
					{children}
				</body>
			</html>
		</ThemeProvider>
	);
}
