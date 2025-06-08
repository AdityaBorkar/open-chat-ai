import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
	'rounded-md bg-primary px-4 py-2 font-medium font-medium text-sm text-sm text-white transition-colors hover:bg-primary/90',
	{
		variants: {
			variant: {
				default: '',
				destructive: 'bg-red-500 hover:bg-red-600',
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
			type={type}
			className={cn(buttonVariants({ variant }), className)}
			{...props}
		>
			{children}
		</button>
	);
}
