import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex items-center rounded-full px-2 py-1 font-medium text-xs',
	{
		defaultVariants: {
			variant: 'default',
		},
		variants: {
			variant: {
				archived: 'border border-gray-600 bg-gray-800 text-gray-400',
				default: 'bg-gray-700 text-gray-300',
				pinned: 'border border-yellow-700 bg-yellow-900 text-yellow-300',
			},
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}
