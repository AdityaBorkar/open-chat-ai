import type { AssistantMessage } from 'ai';
import {
	TbCopy,
	TbGitBranch,
	TbInfoCircle,
	TbPencil,
	TbRefresh,
} from 'react-icons/tb';

import { cn } from '@/lib/utils';

export function MessageAssistant({ message }: { message: AssistantMessage }) {
	return (
		<div
			className={cn(
				'relative z-10 w-fit rounded-lg pt-3 font-medium text-base text-text-primary leading-[1.5] tracking-tight',
			)}
		>
			<div className="-left-16 absolute rounded-full border border-white/40 bg-white/15 px-2 py-0.5">
				CO
			</div>
			<pre>{message.content}</pre>
			<div className="mt-4 flex w-fit flex-row gap-2 rounded-full bg-white/15 p-1">
				<TbInfoCircle className="size-5" />
				<TbRefresh className="size-5" />
				<TbGitBranch className="size-5" />
				<TbPencil className="size-5" />
				<TbCopy className="size-5" />
			</div>
		</div>
	);
}
