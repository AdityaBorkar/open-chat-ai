import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeScript } from '@/components/theme/theme-script';
import { getThemeClass } from '@/lib/theme-utils';
import { cn } from '@/lib/utils';

import './globals.css';

const geistSans = Geist({
	subsets: ['latin'],
	variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-geist-mono',
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

	return (
		<ThemeProvider>
			<html className={themeClass} lang="en">
				<body
					className={cn(
						geistSans.variable,
						geistMono.variable,
						'dark min-h-screen bg-background text-foreground text-sm antialiased',
					)}
				>
					<ThemeScript />
					{children}
				</body>
			</html>
		</ThemeProvider>
	);
}
