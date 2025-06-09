export function Sidebar() {
	return (
		<aside className="">
			<div className="p-6">
				{/* Profile Section */}
				<div className="mb-8">
					<div className="mb-6 flex flex-col items-center gap-4">
						<img
							// ignore for accessibility
							alt=""
							className="size-48 rounded-full object-cover ring-2 ring-gray-700/50"
							src="/api/placeholder/80/80"
						/>
						<div className="text-center">
							<div className="mb-1 font-semibold text-xl">Aditya Borkar</div>
							<div className="mb-2 text-gray-400 ">
								aditya.borkar.programs@gmail.com
							</div>
							<div className="inline-block rounded-full bg-gray-800 px-3 py-1 text-gray-300 text-xs">
								Free Plan
							</div>
						</div>
					</div>
				</div>

				{/* Message Usage */}
				<div className="mb-8 ">
					<div className="mb-3 flex items-center justify-between">
						<span className="font-medium ">Message Usage</span>
						<span className="text-gray-500 text-xs">
							<div>Resets tomorrow at 5:30 AM</div>
							<div>Resets in TIMER</div>
						</span>
					</div>
					<div className="mb-3">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-text-secondary">Standard Credits</span>
							<span className="font-medium">1 / 20</span>
						</div>
						<div className="h-2 w-full rounded-full bg-gray-800">
							<div
								className="h-2 rounded-full bg-pink-500"
								style={{ width: '5%' }}
							></div>
						</div>
					</div>
					<p className="font-medium text-pink-400 ">19 messages remaining</p>
				</div>
			</div>
		</aside>
	);
}
