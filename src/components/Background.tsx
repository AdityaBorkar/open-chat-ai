import { cn } from '@/lib/utils';

export default function Background({
	children,
}: {
	children: React.ReactNode;
}) {
	const common_properties = 'fixed rounded-full pointer-events-none';
	return (
		<div className="bg-[#EDEDED]">
			<div
				className={cn(
					common_properties,
					'-top-[30%] left-[10%] size-[85vh] bg-[#574CCE59]',
					// 'border border-black',
					'blur-[400px]',
				)}
			/>

			<div
				className={cn(
					common_properties,
					'-top-[25vw] -right-[25vw] size-[60vw] bg-[#984CCE45]',
					// 'border border-black',
					'blur-[400px]',
				)}
			/>

			<div
				className={cn(
					common_properties,
					'-left-[30vw] top-[15%] size-[90vh] bg-[#574CCE45]',
					// 'border border-black',
					'blur-[400px]',
				)}
			/>

			<div
				className={cn(
					common_properties,
					'-bottom-[50%] right-[2.5%] size-[70vw] bg-[#D5B5E2]',
					// 'border border-black',
					'blur-[500px]',
				)}
			/>

			<div
				className={cn(
					'z-20',
					common_properties,
					'-bottom-[50%] right-[2.5%] size-[70vw] bg-gradient-to-t from-[#D5B5E2] from-[50%] to-[55%] to-transparent',
					// 'border border-black',
					'blur-[40px]',
				)}
			/>

			{children}
		</div>
	);
}
