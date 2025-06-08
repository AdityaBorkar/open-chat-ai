import NextLink from 'next/link';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type LinkProps = React.ComponentProps<typeof NextLink> & {
	children: React.ReactNode;
};

export function Link({ href, children, className }: LinkProps) {
	return (
		<NextLink
			href={href}
			className={cn(buttonVariants({ variant: 'default' }), className)}
			prefetch={false}
		>
			{children}
		</NextLink>
	);
}
