import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { SETTINGS_NAVIGATION } from '@/components/pages/settings/Navigation/constants';
import { NavLink } from './NavLink';

export function Navigation() {
	// Track ALT key state for highlighting
	const [isAltPressed, setIsAltPressed] = useState(false);
	useEffect(() => {
		// TODO: Do not highlight if the focus is on the input field
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.altKey && !isAltPressed) {
				setIsAltPressed(true);
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (!e.altKey && isAltPressed) {
				setIsAltPressed(false);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [isAltPressed]);

	// ALT + shortkey combinations for navigation
	const router = useRouter();
	for (const { href, shortKey } of SETTINGS_NAVIGATION) {
		useHotkeys(`alt+${shortKey}`, () => {
			router.push(`/settings${href}`);
			// setTimeout(() => {
			// 	const firstFocusable = mainContentRef.current?.querySelector(
			// 		'input, select, textarea, button, a, [tabindex]:not([tabindex="-1"])',
			// 	) as HTMLElement;
			// 	firstFocusable?.focus();
			// }, 100);
		});
	}

	return (
		<nav className="flex w-fit flex-row gap-1 rounded-lg bg-bg-tertiary p-1">
			{SETTINGS_NAVIGATION.map(({ href, label, shortKey }) => (
				<NavLink
					href={`/settings${href}`}
					isAltPressed={isAltPressed}
					key={href}
					label={label}
					shortKey={shortKey}
				/>
			))}
		</nav>
	);
}
