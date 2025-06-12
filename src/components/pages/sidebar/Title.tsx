import type { IconType } from 'react-icons';

export default function Title({
	children,
	icon: Icon,
}: {
	children: React.ReactNode;
	icon?: IconType;
}) {
	return (
		<div className="mt-6 mb-1 w-full px-4 font-medium text-sm text-text-tertiary/40">
			{Icon && <Icon className="mr-1 inline-block size-4" />}
			{children}
		</div>
	);
}
