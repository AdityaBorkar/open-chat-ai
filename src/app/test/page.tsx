import { cn } from '@/lib/utils';

export default function TestPage() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-[#D5D4EB] p-8">
			<div
				className={cn(
					'size-16 rounded-full',
					'bg-white/24',
					'backdrop-blur-md',
				)}
				style={{
					boxShadow: [
						'0px 0px 12px 0px rgba(0, 0, 0, 0.1)',
						'1.5px 1.5px 0px 0px #F2F2F2 inset',
						'-1.5px -1.5px 0px 0px #F2F2F2 inset',
					].join(', '),
				}}
			></div>

			{/* <WorkerStatus /> */}
		</div>
	);
}
