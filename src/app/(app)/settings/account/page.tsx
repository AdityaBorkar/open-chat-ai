export default function AccountPage() {
	return (
		<div className="max-w-5xl">
			{/* Upgrade to Pro Section */}
			<div className="mb-16">
				<div className="mb-10 flex items-start justify-between">
					<div>
						<h1 className="mb-2 font-bold text-4xl text-white">
							Upgrade to Pro
						</h1>
					</div>
					<div className="text-right">
						<div className="font-bold text-4xl text-white">
							$8
							<span className="font-normal text-gray-400 text-xl">/month</span>
						</div>
					</div>
				</div>

				<div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
					{/* Access to All Models */}
					<div className="rounded-xl border border-gray-800/50 bg-gray-900 p-8 transition-colors hover:bg-gray-900/80">
						<div className="mb-6 flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg">
								<svg
									className="h-6 w-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Models icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 className="font-semibold text-white text-xl">
								Access to All Models
							</h3>
						</div>
						<p className="text-gray-400 leading-relaxed">
							Get access to our full suite of models including Claude,
							o3-mini-high, and more!
						</p>
					</div>

					{/* Generous Limits */}
					<div className="rounded-xl border border-gray-800/50 bg-gray-900 p-8 transition-colors hover:bg-gray-900/80">
						<div className="mb-6 flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg">
								<svg
									className="h-6 w-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Limits icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
							</div>
							<h3 className="font-semibold text-white text-xl">
								Generous Limits
							</h3>
						</div>
						<p className="text-gray-400 leading-relaxed">
							Receive{' '}
							<span className="font-semibold text-white">
								1500 standard credits
							</span>{' '}
							per month, plus{' '}
							<span className="font-semibold text-white">
								100 premium credits*
							</span>{' '}
							per month.
						</p>
					</div>

					{/* Priority Support */}
					<div className="rounded-xl border border-gray-800/50 bg-gray-900 p-8 transition-colors hover:bg-gray-900/80">
						<div className="mb-6 flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg">
								<svg
									className="h-6 w-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Support icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="font-semibold text-white text-xl">
								Priority Support
							</h3>
						</div>
						<p className="text-gray-400 leading-relaxed">
							Get faster responses and dedicated assistance from the T3 team
							whenever you need help!
						</p>
					</div>
				</div>

				<div className="mb-6 text-center">
					<button
						type="button"
						className="transform rounded-xl bg-gradient-to-r from-pink-600 to-pink-700 px-12 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-pink-700 hover:to-pink-800"
					>
						Upgrade Now
					</button>
				</div>

				<p className="mx-auto max-w-3xl text-center text-gray-500 text-xs leading-relaxed">
					* Premium credits are used for GPT Image Gen, Claude Sonnet, and Grok
					3. Additional Premium credits can be purchased separately.
				</p>
			</div>

			{/* Danger Zone */}
			<div className="rounded-xl border border-red-900/30 bg-gray-900 p-8">
				<h2 className="mb-3 font-bold text-2xl text-white">Danger Zone</h2>
				<p className="mb-8 text-gray-400 leading-relaxed">
					Permanently delete your account and all associated data.
				</p>
				<button
					type="button"
					className="rounded-lg border border-red-500/50 bg-red-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-red-700"
				>
					Delete Account
				</button>
			</div>
		</div>
	);
}
