import { useAtomValue } from 'jotai';
import Image from 'next/image';

import { userAtom } from '@/components/pages/sidebar/atoms';
import { Link } from '@/components/ui/Link';
import { cn } from '@/lib/utils';

export function UserInfo({ className }: { className?: string }) {
	const user = useAtomValue(userAtom);
	return (
		<Link
			className={cn(
				'flex items-center gap-x-3 rounded-full px-2.5 py-2 hover:bg-bg-secondary',
				className,
			)}
			href="/settings/account"
			// variant="compact"
		>
			<div className="size-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-600">
				{user.avatarUrl && (
					<Image
						alt="User Avatar"
						className="size-full rounded-full object-cover"
						height={32}
						src={user.avatarUrl}
						width={32}
					/>
				)}
			</div>
			<div className="text-sm text-text-primary leading-snug">
				<div className="font-semibold">{user.name}</div>
				<div>{user.plan}</div>
			</div>
		</Link>
	);
}
