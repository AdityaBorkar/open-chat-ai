'use client';

import { TbAB, TbShare } from 'react-icons/tb';

import UserInput from '@/components/pages/convo/UserInput';

export default function NewChatPage() {
	// TODO: Show the ConvoID Screen and replace the path
	return (
		<div className="relative flex h-full flex-1 flex-col">
			<div className="absolute top-4 right-8 flex items-center justify-between gap-2">
				<div className="flex flex-row rounded-full bg-white/30">
					<button className="p-2" type="button">
						<TbShare className="size-5" />
					</button>
					<button className="p-2" type="button">
						<TbAB className="size-5" />
					</button>
				</div>
				<div className="size-8 rounded-full border border-white bg-white/50 text-center text-[#7D45E4]">
					<div className="text-lg leading-[1.9]">X</div>
				</div>
			</div>
			<div className="absolute bottom-0 left-[calc(50%-24rem)] mx-auto w-[48rem]">
				<div
					className="absolute bottom-0 h-12 w-full "
					style={{
						background:
							'linear-gradient(180deg, rgba(220, 196, 230, 0.00) 0%, #DCC4E6 100%)',
					}}
				/>
				<UserInput />
			</div>
		</div>
	);
}
