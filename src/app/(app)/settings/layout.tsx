'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { TbArrowLeft } from 'react-icons/tb';

import { Sidebar } from '@/app/(app)/settings/Sidebar';
import { Button } from '@/components/ui/Button';
import { Link } from '@/components/ui/Link';
import { cn } from '@/lib/utils';

const NAV_PATHS = [
	{ href: '/account', label: 'Account', shortKey: 'A' },
	{ href: '/customization', label: 'Customization', shortKey: 'U' },
	{ href: '/history', label: 'History', shortKey: 'H' },
	{ href: '/models', label: 'Models', shortKey: 'M' },
	{ href: '/api-keys', label: 'API Keys', shortKey: 'K' },
	{ href: '/attachments', label: 'Attachments', shortKey: 'T' },
	{ href: '/contact', label: 'Contact Us', shortKey: 'C' },
];

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const mainContentRef = useRef<HTMLElement>(null);

	useHotkeys('esc', () => router.push('/chat'));

	// ALT + shortkey combinations for navigation
	for (const { href, shortKey } of NAV_PATHS) {
		useHotkeys(`alt+${shortKey}`, () => {
			router.push(`/settings${href}`);
			setTimeout(() => {
				const firstFocusable = mainContentRef.current?.querySelector(
					'input, select, textarea, button, a, [tabindex]:not([tabindex="-1"])',
				) as HTMLElement;
				firstFocusable?.focus();
			}, 100);
		});
	}

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

	return (
		<div className="mx-auto max-w-[80rem]">
			<div className="mt-4 mb-12 flex flex-row items-center justify-between gap-4 px-6 py-4">
				<Link href="/chat">
					<TbArrowLeft className="inline-block size-5" />
					Back to Chat
				</Link>
				<div className="grow" />
				<Button>
					Theme
					{/* <ThemeToggle /> */}
				</Button>
				<Button>Sign out</Button>
			</div>

			<div className=" grid grid-cols-[24rem_1fr] gap-16">
				{/* Sidebar */}
				<Sidebar />

				<div>
					{/* Navigation Tabs */}
					<nav className="flex w-fit flex-row gap-2 rounded-lg bg-bg-tertiary p-1">
						{NAV_PATHS.map(({ href, label, shortKey }) => (
							<NavLink
								href={`/settings${href}`}
								isAltPressed={isAltPressed}
								key={href}
								label={label}
								shortKey={shortKey}
							/>
						))}
					</nav>

					{/* Main Content */}
					<main className="py-8" ref={mainContentRef}>
						{children}
					</main>
				</div>
			</div>
		</div>
	);
}

function NavLink({
	href,
	label,
	shortKey,
	isAltPressed,
}: {
	href: string;
	label: string;
	shortKey: string;
	isAltPressed: boolean;
}) {
	const path = usePathname();
	const isActive = path === href;

	// Find the first occurrence of shortKey in label and highlight it
	const highlightShortKey = (text: string, key: string) => {
		if (!isAltPressed) return text;

		const keyIndex = text.toLowerCase().indexOf(key.toLowerCase());
		if (keyIndex === -1) return text;

		const before = text.slice(0, keyIndex);
		const highlighted = text.slice(keyIndex, keyIndex + 1);
		const after = text.slice(keyIndex + 1);

		return (
			<>
				{before}
				<span className="text-text-secondary underline decoration-2 underline-offset-2">
					{highlighted}
				</span>
				{after}
			</>
		);
	};

	return (
		<Link
			className={cn(
				'rounded-md px-2.5 py-1.5 font-semibold text-text-tertiary tracking-wide',
				isActive && 'bg-bg-primary/75 text-text-primary',
			)}
			href={href}
		>
			{highlightShortKey(label, shortKey)}
		</Link>
	);
}
