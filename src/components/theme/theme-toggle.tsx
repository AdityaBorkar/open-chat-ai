'use client';

import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';

import { useTheme } from './theme-provider';

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	const handleToggle = () => {
		if (theme === 'light') {
			setTheme('dark');
		} else if (theme === 'dark') {
			setTheme('system');
		} else {
			setTheme('light');
		}
	};

	const getIcon = () => {
		switch (theme) {
			case 'light':
				return <IconSun size={20} />;
			case 'dark':
				return <IconMoon size={20} />;
			case 'system':
				return <IconDeviceDesktop size={20} />;
			default:
				return <IconMoon size={20} />;
		}
	};

	const getLabel = () => {
		switch (theme) {
			case 'light':
				return 'Light mode';
			case 'dark':
				return 'Dark mode';
			case 'system':
				return 'System theme';
			default:
				return 'Theme';
		}
	};

	return (
		<button
			aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
			className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-secondary"
			onClick={handleToggle}
			title={getLabel()}
			type="button"
		>
			{getIcon()}
			<span className="text-sm">{getLabel()}</span>
		</button>
	);
}
