import { cn } from '@/lib/utils';

export default function Background({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="bg-[#EDEDED]">
			<div
				className={cn(
					'-top-[30%] fixed left-[10%] size-[85vh] rounded-full bg-[#574CCE59]',
					// 'border border-black',
					'blur-[400px]',
				)}
			/>

			<div
				className={cn(
					'-top-[25vw] -right-[25vw] fixed size-[60vw] rounded-full bg-[#984CCE45]',
					// 'border border-black',
					'blur-[400px]',
				)}
			/>

			<div
				className={cn(
					'-left-[30vw] fixed top-[15%] size-[90vh] rounded-full bg-[#574CCE45]',
					// 'border border-black',
					'blur-[400px]',
				)}
			/>

			<div
				className={cn(
					'-bottom-[50%] fixed right-[2.5%] size-[70vw] rounded-full bg-[#A94CCE]/35',
					// 'border border-black',
					'blur-[500px]',
				)}
			/>

			{/* <div
				className={cn(
					'-bottom-[50%] fixed right-[2.5%] size-[70vw] rounded-full bg-[#d8aaeb]',
					// 'border border-black',
					'blur-[500px]',
				)}
			/>
			<div
				className={cn(
					'z-20',
					'-bottom-[50%] fixed right-[2.5%] size-[70vw] rounded-full bg-gradient-to-t from-[#f9ebff] from-[50%] to-[60%] to-transparent',
					// 'border border-black',
					'blur-[500px]',
				)}
			/> */}

			{children}
		</div>
	);
}
