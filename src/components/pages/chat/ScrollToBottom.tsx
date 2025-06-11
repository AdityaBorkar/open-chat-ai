import { TbArrowDown } from 'react-icons/tb';

export default function ScrollToBottom() {
	return (
		<button
			className="mx-auto mb-4 block w-fit rounded-full border border-border/10 bg-bg-secondary/20 px-4 py-2 text-center text-sm text-text-secondary hover:bg-bg-secondary/30"
			type="button"
		>
			<TbArrowDown className="-mt-0.5 mr-1 inline-block size-4" />
			Scroll to bottom
		</button>
	);
}
