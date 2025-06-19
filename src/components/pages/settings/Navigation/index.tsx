import { useEffect, useState } from 'react';
import { TbExternalLink } from 'react-icons/tb';

import { SETTINGS_NAVIGATION } from '@/components/pages/settings/Navigation/constants';
import { Link } from '@/components/ui/Link';
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
	// const router = useRouter();
	// for (const { href, shortKey } of SETTINGS_NAVIGATION) {
	// 	useHotkeys(`alt+${shortKey}`, () => {
	// 		router.push(`/settings${href}`);
	// 		// setTimeout(() => {
	// 		// 	const firstFocusable = mainContentRef.current?.querySelector(
	// 		// 		'input, select, textarea, button, a, [tabindex]:not([tabindex="-1"])',
	// 		// 	) as HTMLElement;
	// 		// 	firstFocusable?.focus();
	// 		// }, 100);
	// 	});
	// }

	return (
		<nav className="flex w-56 flex-col gap-1 rounded-l-3xl border border-border/30 bg-bg-secondary/50 p-4">
			{SETTINGS_NAVIGATION.map(({ href, label, shortKey }) => (
				<NavLink
					href={`/settings${href}`}
					isAltPressed={isAltPressed}
					key={href}
					label={label}
					shortKey={shortKey}
				/>
			))}
			<div className="grow" />
			<SecondaryLink href="/changelog" label="Changelog" />
			<SecondaryLink href="/community" label="Community" />
			<SecondaryLink
				href="https://docs.hello-world.com"
				label="Documentation"
			/>
			<SecondaryLink
				href="https://status.hello-world.com"
				label="Platform Status"
			/>
		</nav>
	);
}

function SecondaryLink({ href, label }: { href: string; label: string }) {
	return (
		<Link
			className="group flex items-center justify-between px-3 py-1 font-medium text-sm text-text-tertiary/25 hover:bg-bg-secondary hover:text-text-tertiary"
			href={href}
			target="_blank"
		>
			{label}
			<TbExternalLink className="-mt-0.5 hidden size-4 group-hover:block" />
		</Link>
	);
}
