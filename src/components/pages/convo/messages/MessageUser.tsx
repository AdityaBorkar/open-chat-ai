import { cn } from '@/lib/utils';

type UserMessage = {
	content: string;
	id: string;
	role: 'user';
	timestamp: string;
};

export function MessageUser({ message }: { message: UserMessage }) {
	return (
		<div
			className={cn(
				'w-fit rounded-xl bg-white/40 px-4 py-2.5 font-medium text-base text-text-primary tracking-tight',
			)}
		>
			{message.content}
		</div>
	);
}
