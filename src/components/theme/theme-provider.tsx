'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
	children: React.ReactNode;
	defaultTheme?: Theme;
	forcedTheme?: 'light' | 'dark';
}

export function ThemeProvider({
	children,
	defaultTheme = 'system',
	forcedTheme,
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(defaultTheme);
	const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

	useEffect(() => {
		// Get stored theme or use default
		const storedTheme = localStorage.getItem('theme') as Theme;
		if (storedTheme) {
			setTheme(storedTheme);
		}
	}, []);

	useEffect(() => {
		const root = window.document.documentElement;

		if (forcedTheme) {
			setResolvedTheme(forcedTheme);
			root.classList.remove('light', 'dark');
			root.classList.add(forcedTheme);
			return;
		}

		const updateResolvedTheme = () => {
			let newResolvedTheme: 'light' | 'dark';

			if (theme === 'system') {
				newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)')
					.matches
					? 'dark'
					: 'light';
			} else {
				newResolvedTheme = theme as 'light' | 'dark';
			}

			setResolvedTheme(newResolvedTheme);
			root.classList.remove('light', 'dark');
			root.classList.add(newResolvedTheme);
		};

		updateResolvedTheme();

		// Listen for system theme changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			if (theme === 'system') {
				updateResolvedTheme();
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [theme, forcedTheme]);

	const handleSetTheme = (newTheme: Theme) => {
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
	};

	return (
		<ThemeContext.Provider
			value={{ resolvedTheme, setTheme: handleSetTheme, theme }}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
