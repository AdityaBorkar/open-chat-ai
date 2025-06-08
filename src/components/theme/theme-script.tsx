import Script from 'next/script';

export function ThemeScript() {
	return (
		<Script strategy="beforeInteractive">
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
	);
}
