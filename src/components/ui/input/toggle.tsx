import { useState } from 'react';

import { cn } from '@/lib/utils';

interface ToggleInputProps {
	className?: string;
	defaultValue?: boolean;
	icon: React.ElementType;
}

export function ToggleInput({
	defaultValue = false,
	icon: Icon,
	className,
}: ToggleInputProps) {
	const [active, setActive] = useState(defaultValue);
	return (
		<button
			className={cn(
				'flex size-12 items-center justify-center rounded-full transition-colors',
				active
					? 'text-purple-700'
					: 'bg-transparent text-neutral-600 hover:bg-white/20',
				className,
			)}
			onClick={() => setActive(!active)}
			type="button"
		>
			<Icon className="size-5" />
		</button>
	);
}
