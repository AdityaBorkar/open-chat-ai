import { useState } from 'react';

import { cn } from '@/lib/utils';

export function Tabs({
	className,
	items,
	defaultIndex = 0,
}: {
	className?: string;
	items: {
		children: React.ReactNode;
		label: string;
	}[];
	defaultIndex?: number;
}) {
	const [tabIndex, setTabIndex] = useState(defaultIndex);
	return (
		<>
			<div
				className={cn(
					'rounded-full border border-border/20 bg-white/25 p-1.5 text-center backdrop-blur-xl',
					className,
				)}
			>
				{items.map((item, index) => (
					<TabItem
						isActive={tabIndex === index}
						key={item.label}
						onClick={() => setTabIndex(index)}
					>
						{item.label}
					</TabItem>
				))}
			</div>
			{items.map((item, index) => (
				// ! Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
				// <Activity
				// 	key={item.label}
				// 	mode={index === tabIndex ? 'visible' : 'hidden'}
				// >
				// 	{item.children}
				// </Activity>
				<div
					className={cn(index === tabIndex ? 'block' : 'hidden')}
					key={item.label}
				>
					{item.children}
				</div>
			))}
		</>
	);
}

function TabItem({
	children,
	onClick,
	isActive,
}: {
	children: React.ReactNode;
	onClick: () => void;
	isActive: boolean;
}) {
	return (
		<button
			className={cn(
				'rounded-full border border-transparent px-2 py-1.5 font-medium text-base',
				isActive
					? 'inset-shadow-[0px_0px_32px_0px_#FFF] border-white bg-white/50 text-black'
					: 'text-black/50 hover:bg-bg-tertiary/50',
			)}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}
