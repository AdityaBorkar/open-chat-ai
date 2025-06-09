import type { VariantProps } from 'class-variance-authority';
import NextLink from 'next/link';

import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type LinkProps = React.ComponentProps<typeof NextLink> & {
	children: React.ReactNode;
	variant?: 'default' | 'compact';
} & VariantProps<typeof buttonVariants>;

export function Link({
	href,
	children,
	className,
	variant = 'default',
}: LinkProps) {
	return (
		<NextLink
			className={cn(buttonVariants({ variant }), className)}
			href={href}
			prefetch={false}
		>
			{children}
		</NextLink>
	);
}
