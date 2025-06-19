'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
	'inline-flex items-center justify-center rounded-full font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		defaultVariants: {
			size: 'sm',
			variant: 'default',
		},
		variants: {
			size: {
				default: 'h-10 w-10',
				lg: 'h-12 w-12',
				sm: 'h-8 w-8',
			},
			variant: {
				default:
					'hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
				outline:
					'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
			},
		},
	},
);

interface ToggleProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof toggleVariants> {
	pressed?: boolean;
	onPressedChange?: (pressed: boolean) => void;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
	(
		{
			className,
			variant,
			size,
			pressed = false,
			onPressedChange,
			onClick,
			...props
		},
		ref,
	) => {
		const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			onClick?.(event);
			onPressedChange?.(!pressed);
		};

		return (
			<button
				aria-pressed={pressed}
				className={cn(toggleVariants({ className, size, variant }))}
				data-state={pressed ? 'on' : 'off'}
				onClick={handleClick}
				ref={ref}
				{...props}
			/>
		);
	},
);

Toggle.displayName = 'Toggle';

export { Toggle, toggleVariants };
