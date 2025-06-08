export default function AttachmentsPage() {
	return (
		<div className="max-w-4xl">
			<div className="mb-8">
				<h1 className="mb-2 font-bold text-3xl text-white">Attachments</h1>
				<p className="text-gray-400">
					Configure file upload settings and manage attachment preferences.
				</p>
			</div>

			{/* Upload Settings */}
			<div className="mb-8 rounded-lg bg-gray-800 p-6">
				<h2 className="mb-4 font-semibold text-white text-xl">
					Upload Settings
				</h2>

				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-medium text-white">Enable File Uploads</h3>
							<p className="text-gray-400 text-sm">
								Allow uploading images, PDFs, and documents to conversations
							</p>
						</div>
						<label className="relative inline-flex cursor-pointer items-center">
							<input type="checkbox" className="peer sr-only" defaultChecked />
							<div className="peer h-6 w-11 rounded-full bg-gray-600 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
						</label>
					</div>

					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-medium text-white">Auto-resize Images</h3>
							<p className="text-gray-400 text-sm">
								Automatically resize large images to optimize processing
							</p>
						</div>
						<label className="relative inline-flex cursor-pointer items-center">
							<input type="checkbox" className="peer sr-only" defaultChecked />
							<div className="peer h-6 w-11 rounded-full bg-gray-600 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-pink-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
						</label>
					</div>

					<div>
						<label className="mb-2 block font-medium text-white">
							Max File Size
						</label>
						<p className="mb-3 text-gray-400 text-sm">
							Maximum file size for uploads (in MB)
						</p>
						<select className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-pink-500 focus:outline-none">
							<option value="5">5 MB</option>
							<option value="10" selected>
								10 MB
							</option>
							<option value="25">25 MB</option>
							<option value="50">50 MB</option>
						</select>
					</div>
				</div>
			</div>

			{/* Supported File Types */}
			<div className="mb-8 rounded-lg bg-gray-800 p-6">
				<h2 className="mb-4 font-semibold text-white text-xl">
					Supported File Types
				</h2>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Images */}
					<div>
						<h3 className="mb-3 flex items-center gap-2 font-medium text-white">
							<span className="text-lg">🖼️</span>
							Images
						</h3>
						<div className="space-y-2">
							{['JPEG', 'PNG', 'GIF', 'WebP', 'SVG'].map((format) => (
								<div key={format} className="flex items-center justify-between">
									<span className="text-gray-400 text-sm">{format}</span>
									<div className="h-3 w-3 rounded-full bg-green-500"></div>
								</div>
							))}
						</div>
					</div>

					{/* Documents */}
					<div>
						<h3 className="mb-3 flex items-center gap-2 font-medium text-white">
							<span className="text-lg">📄</span>
							Documents
						</h3>
						<div className="space-y-2">
							{['PDF', 'DOC', 'DOCX', 'TXT', 'MD'].map((format) => (
								<div key={format} className="flex items-center justify-between">
									<span className="text-gray-400 text-sm">{format}</span>
									<div className="h-3 w-3 rounded-full bg-green-500"></div>
								</div>
							))}
						</div>
					</div>

					{/* Code Files */}
					<div>
						<h3 className="mb-3 flex items-center gap-2 font-medium text-white">
							<span className="text-lg">💻</span>
							Code Files
						</h3>
						<div className="space-y-2">
							{['JS', 'TS', 'PY', 'HTML', 'CSS'].map((format) => (
								<div key={format} className="flex items-center justify-between">
									<span className="text-gray-400 text-sm">{format}</span>
									<div className="h-3 w-3 rounded-full bg-green-500"></div>
								</div>
							))}
						</div>
					</div>

					{/* Data Files */}
					<div>
						<h3 className="mb-3 flex items-center gap-2 font-medium text-white">
							<span className="text-lg">📊</span>
							Data Files
						</h3>
						<div className="space-y-2">
							{['JSON', 'CSV', 'XML', 'YAML', 'SQL'].map((format) => (
								<div key={format} className="flex items-center justify-between">
									<span className="text-gray-400 text-sm">{format}</span>
									<div className="h-3 w-3 rounded-full bg-green-500"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Storage Usage */}
			<div className="mb-8 rounded-lg bg-gray-800 p-6">
				<h2 className="mb-4 font-semibold text-white text-xl">Storage Usage</h2>

				<div className="mb-4">
					<div className="mb-2 flex items-center justify-between">
						<span className="text-gray-400 text-sm">Used Storage</span>
						<span className="font-medium text-sm text-white">
							234 MB / 1 GB
						</span>
					</div>
					<div className="h-2 w-full rounded-full bg-gray-700">
						<div
							className="h-2 rounded-full bg-pink-500"
							style={{ width: '23.4%' }}
						></div>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
					<div className="rounded-lg bg-gray-700 p-4">
						<div className="font-bold text-2xl text-white">42</div>
						<div className="text-gray-400 text-sm">Images</div>
					</div>
					<div className="rounded-lg bg-gray-700 p-4">
						<div className="font-bold text-2xl text-white">18</div>
						<div className="text-gray-400 text-sm">Documents</div>
					</div>
					<div className="rounded-lg bg-gray-700 p-4">
						<div className="font-bold text-2xl text-white">9</div>
						<div className="text-gray-400 text-sm">Code Files</div>
					</div>
				</div>
			</div>

			{/* Cleanup Options */}
			<div className="rounded-lg bg-gray-800 p-6">
				<h2 className="mb-4 font-semibold text-white text-xl">
					Cleanup Options
				</h2>
				<p className="mb-4 text-gray-400">
					Manage your uploaded files and free up storage space.
				</p>

				<div className="flex gap-3">
					<button
						type="button"
						className="rounded-lg bg-pink-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-pink-700"
					>
						Manage Files
					</button>
					<button
						type="button"
						className="rounded-lg bg-gray-700 px-6 py-2 font-semibold text-white transition-colors hover:bg-gray-600"
					>
						Delete Old Files
					</button>
				</div>
			</div>
		</div>
	);
}
