import type { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

export default function Title({
	children,
	icon: Icon,
}: {
	children: React.ReactNode;
	icon?: IconType;
}) {
	return (
		<div
			className={cn(
				'group relative mx-1 mt-6 block px-2 py-2 font-semibold',
				' text-sm text-text-secondary',
			)}
		>
			{Icon && (
				<Icon className="-mt-1 mr-1 inline-block size-4 text-[#515151]" />
			)}
			{children}
		</div>
	);
}
