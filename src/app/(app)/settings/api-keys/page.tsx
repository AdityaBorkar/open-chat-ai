export default function ApiKeysPage() {
	const providers = [
		{
			name: 'OpenAI',
			icon: '🤖',
			description: 'Access GPT-4, GPT-3.5, and other OpenAI models',
			status: 'connected',
		},
		{
			name: 'Anthropic',
			icon: '🔷',
			description: 'Access Claude 3.5 Sonnet and other Claude models',
			status: 'connected',
		},
		{
			name: 'Google AI',
			icon: '🔥',
			description: 'Access Gemini Pro and other Google models',
			status: 'not_connected',
		},
		{
			name: 'OpenRouter',
			icon: '🚀',
			description: 'Access to multiple models through OpenRouter',
			status: 'not_connected',
		},
		{
			name: 'Mistral',
			icon: '🌪️',
			description: 'Access Mistral 7B and other Mistral models',
			status: 'not_connected',
		},
	];

	return (
		<div className="max-w-4xl">
			<div className="mb-8">
				<h1 className="mb-2 font-bold text-3xl text-white">API Keys</h1>
				<p className="text-gray-400">
					Connect your own API keys to access different AI models and services.
				</p>
			</div>

			{/* API Key Providers */}
			<div className="mb-8">
				<h2 className="mb-6 font-semibold text-white text-xl">
					Connected Services
				</h2>
				<div className="space-y-4">
					{providers.map((provider) => (
						<div
							key={provider.name}
							className="rounded-lg border border-gray-700 bg-gray-800 p-6"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="text-2xl">{provider.icon}</div>
									<div>
										<h3 className="font-semibold text-lg text-white">
											{provider.name}
										</h3>
										<p className="text-gray-400 text-sm">
											{provider.description}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<span
										className={`rounded-full px-3 py-1 font-medium text-xs ${
											provider.status === 'connected'
												? 'bg-green-500/20 text-green-300'
												: 'bg-gray-600/50 text-gray-300'
										}`}
									>
										{provider.status === 'connected'
											? 'Connected'
											: 'Not Connected'}
									</span>
									<button
										type="button"
										className={`rounded-lg px-4 py-2 font-medium text-sm transition-colors ${
											provider.status === 'connected'
												? 'bg-gray-700 text-white hover:bg-gray-600'
												: 'bg-pink-600 text-white hover:bg-pink-700'
										}`}
									>
										{provider.status === 'connected' ? 'Manage' : 'Connect'}
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Add New API Key */}
			<div className="mb-8 rounded-lg bg-gray-800 p-6">
				<h2 className="mb-4 font-semibold text-white text-xl">
					Add New API Key
				</h2>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="provider-select"
							className="mb-2 block font-medium text-white"
						>
							Provider
						</label>
						<select
							id="provider-select"
							className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
						>
							<option value="">Select a provider</option>
							<option value="openai">OpenAI</option>
							<option value="anthropic">Anthropic</option>
							<option value="google">Google AI</option>
							<option value="openrouter">OpenRouter</option>
							<option value="mistral">Mistral</option>
						</select>
					</div>
					<div>
						<label
							htmlFor="api-key-input"
							className="mb-2 block font-medium text-white"
						>
							API Key
						</label>
						<input
							id="api-key-input"
							type="password"
							placeholder="Enter your API key..."
							className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
						/>
					</div>
					<div>
						<label
							htmlFor="key-name-input"
							className="mb-2 block font-medium text-white"
						>
							Name (Optional)
						</label>
						<input
							id="key-name-input"
							type="text"
							placeholder="e.g., Personal OpenAI Key"
							className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
						/>
					</div>
					<button
						type="button"
						className="rounded-lg bg-pink-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-pink-700"
					>
						Add API Key
					</button>
				</div>
			</div>

			{/* Security Notice */}
			<div className="rounded-lg border border-yellow-700/50 bg-yellow-900/20 p-6">
				<div className="flex items-start gap-3">
					<div className="text-xl text-yellow-400">⚠️</div>
					<div>
						<h3 className="mb-2 font-semibold text-yellow-400">
							Security Notice
						</h3>
						<div className="space-y-2 text-sm text-yellow-200">
							<p>
								Your API keys are encrypted and stored securely. They are only
								used to make requests to the respective AI services on your
								behalf.
							</p>
							<p>
								Never share your API keys with others, and make sure to rotate
								them regularly for enhanced security.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
