export default function AccountPage() {
	return (
		<div>
			{/* {is_pro ? <BillingSection /> : <UpgradeSection />} */}

			<section>
				<h2 className="mb-3 font-bold text-2xl text-white">Workspaces</h2>
				<div>
					<div className="mb-8 text-gray-400 leading-relaxed">
						List Workspace Name, Icon, Description and Leave Workspace
					</div>
					<div className="mb-8 text-gray-400 leading-relaxed">
						Create a new workspace
					</div>
				</div>
			</section>

			{/* Danger Zone */}
			<section>
				<h2 className="mb-3 font-bold text-2xl text-white">Account Zone</h2>
				<div>
					<div className="mb-8 text-gray-400 leading-relaxed">Change Name</div>
					<div className="mb-8 text-gray-400 leading-relaxed">Change Email</div>
					<div className="mb-8 text-gray-400 leading-relaxed">
						Change User Name
					</div>
					<div className="mb-8 text-gray-400 leading-relaxed">
						Change Password
					</div>
					<div className="mb-8 text-gray-400 leading-relaxed">
						OAuth Linked Provider Name only
					</div>
				</div>
			</section>
			<section>
				<h2 className="mb-3 font-bold text-2xl text-white">Sessions</h2>
				<div>
					<div className="mb-8 text-gray-400 leading-relaxed">Change Name</div>
					<div className="mb-8 text-gray-400 leading-relaxed">Change Email</div>
					<div className="mb-8 text-gray-400 leading-relaxed">
						Change User Name
					</div>
					<div className="mb-8 text-gray-400 leading-relaxed">
						Change Password
					</div>
					<div className="mb-8 text-gray-400 leading-relaxed">
						OAuth Linked Provider Name only
					</div>
				</div>
			</section>

			{/* Danger Zone */}
			<section>
				<h2 className="mb-3 font-bold text-2xl text-white">Danger Zone</h2>
				<div className="flex items-center justify-between">
					<p className="mb-8 text-gray-400 leading-relaxed">
						Permanently delete your account and all associated data.
					</p>
					<button
						className="rounded-lg border border-red-500/50 bg-red-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-red-700"
						type="button"
					>
						Delete Account
					</button>
				</div>
			</section>
		</div>
	);
}
