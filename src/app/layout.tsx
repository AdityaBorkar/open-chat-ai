// biome-ignore assist/source/organizeImports: ReactScan must be imported before anything else
import { ReactScan } from '@/components/ReactScan';

import type { Metadata } from 'next';
import { Figtree, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeScript } from '@/components/theme/theme-script';
import { getThemeClass } from '@/lib/theme-utils';
import { cn } from '@/lib/utils';

import './globals.css';

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
	const flags = { reactScan: false };
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
					<ThemeScript />
					{children}
				</body>
			</html>
		</ThemeProvider>
	);
}
