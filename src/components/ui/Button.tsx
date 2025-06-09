import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
	'rounded-md bg-primary px-4 py-2 font-medium font-medium text-sm text-sm text-white transition-colors hover:bg-primary/90',
	{
		variants: {
			variant: {
				compact: 'px-3 py-2.5 text-xs hover:bg-bg-secondary',
				default: '',
				destructive: 'bg-red-500 hover:bg-red-600',
				hero: 'bg-gradient-to-r from-pink-600 to-pink-700 px-16 py-2 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-pink-700 hover:to-pink-800',
			},
		},
	},
);

type ButtonProps = VariantProps<typeof buttonVariants> &
	React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
	children,
	type = 'button',
	className,
	variant = 'default',
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(buttonVariants({ variant }), className)}
			type={type}
			{...props}
		>
			{children}
		</button>
	);
}
