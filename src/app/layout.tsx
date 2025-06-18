/** biome-ignore-all lint/nursery/useUniqueElementIds: Custom Scripts */
// biome-ignore assist/source/organizeImports: ReactScan must be imported before anything else
import { ReactScan } from '@/components/dev/ReactScan';

import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { APP } from '@/lib/constants';
import { cn } from '@/lib/utils';

import './globals.css';

const fontSans = Inter({
	subsets: ['latin'],
	variable: '--font-font-sans',
});

const fontMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-font-mono',
});

export const metadata: Metadata = {
	appleWebApp: {
		capable: true,
		startupImage: APP.icon[192],
		statusBarStyle: 'default',
		title: APP.name,
	},
	description: APP.description,
	title: APP.name,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// const themeClass = await getThemeClass();
	const flags = { reactScan: true };
	return (
		// <ThemeProvider>
		<html
			lang="en"
			//  className={themeClass}
		>
			{flags.reactScan && <ReactScan />}
			<body
				className={cn(
					fontSans.variable,
					fontMono.variable,
					'dark min-h-screen bg-background text-base text-foreground antialiased',
				)}
			>
				{/* <Script
						// biome-ignore lint/security/noDangerouslySetInnerHtml: Custom Script
						dangerouslySetInnerHTML={{
							__html: `
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
							`,
						}}
						id="theme-script"
						strategy="beforeInteractive"
					/> */}
				{children}
			</body>
		</html>
		// </ThemeProvider>
	);
}
