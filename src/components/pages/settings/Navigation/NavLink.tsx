import { usePathname } from 'next/navigation';

import { Link } from '@/components/ui/Link';
import { cn } from '@/lib/utils';

export function NavLink({
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
		if (!isAltPressed) {
			return text;
		}

		const keyIndex = text.toLowerCase().indexOf(key.toLowerCase());
		if (keyIndex === -1) {
			return text;
		}

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
				'rounded-lg px-3 py-1 font-medium text-base text-text-tertiary/50',
				isActive
					? 'bg-bg-tertiary text-text-primary hover:bg-bg-tertiary '
					: 'hover:bg-bg-tertiary/25',
			)}
			href={href}
		>
			{highlightShortKey(label, shortKey)}
		</Link>
	);
}
