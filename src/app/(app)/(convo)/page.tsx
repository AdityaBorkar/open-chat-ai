'use client';

import UserInput from '@/components/pages/convo/UserInput';

export default function NewChatPage() {
	return (
		<div className="relative flex h-full flex-1 flex-col">
			<div className="absolute bottom-2 left-[calc(50%-24rem)] mx-auto w-[48rem]">
				<UserInput />
			</div>
		</div>
	);
}
