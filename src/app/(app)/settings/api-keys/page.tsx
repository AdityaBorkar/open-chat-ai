import { Fragment } from 'react';
import { TbSettings } from 'react-icons/tb';

import { Button } from '@/components/ui/Button';
import providers from '@/lib/api-providers.json';
import providersTpa from '@/lib/api-providers.tpa.json';
import { cn } from '@/lib/utils';

type Provider = (typeof providers)[number];

export default function ApiKeysPage() {
	return (
		<div>
			<div className="mb-8">
				<h2 className="mb-2 font-bold text-3xl text-white">API Keys</h2>
				<p className="text-gray-400">
					Connect your own API keys to access different AI models and services.
				</p>
			</div>

			<div className="mb-8">
				<div className="flex ">
					<div className="px-4 py-2 font-semibold text-lg text-white">
						First-Party
					</div>
					<div className="px-4 py-2 font-semibold text-lg text-white">
						Third-Party
					</div>
					<div className="px-4 py-2 font-semibold text-lg text-white">
						Local
					</div>
				</div>
				<div className="space-y-2 ">
					<Separator />
					{providers.map((provider) => (
						<Fragment key={provider.name}>
							<Provider provider={provider} />
							<Separator />
						</Fragment>
					))}
					<Separator />
					{providersTpa.map((provider) => (
						<Fragment key={provider.name}>
							<Provider provider={provider} />
							<Separator />
						</Fragment>
					))}
				</div>
			</div>

			{/* Security Notice */}
			<div className="rounded-lg border border-orange-700/50 bg-orange-900/20 px-6 py-4">
				<div className="flex items-start gap-3">
					<div>
						<div className="mb-2 font-semibold text-base text-orange-400">
							⚠️ Security Notice
						</div>
						<p className="text-orange-200 text-sm leading-relaxed">
							Your API keys are encrypted and stored securely. They are only
							used to make requests to the respective AI services on your
							behalf. Never share your API keys with others, and make sure to
							rotate them regularly for enhanced security.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function Separator() {
	return <div className="h-px bg-border/25" />;
}

function Provider({ provider }: { provider: Provider }) {
	return (
		<div className="rounded-lg bg-bg-secondary/50 px-4 py-4 hover:bg-bg-secondary">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="text-2xl">{provider.icon}</div>
					<div>
						<div className="font-semibold text-lg text-white">
							{provider.name}
							<span
								className={cn(
									'-mt-1 ml-2 inline-block rounded-full px-2 py-0.5 font-medium text-xs',
									provider.status === 'connected'
										? 'bg-green-500/20 text-green-300'
										: 'bg-gray-600/50 text-gray-300',
								)}
							>
								{provider.status === 'connected'
									? 'Connected'
									: 'Not Connected'}
							</span>
							{provider.status === 'connected' && (
								<span
									className={cn(
										'-mt-1 ml-1 inline-block rounded-full px-2 py-0.5 font-medium text-xs',
										'bg-orange-500/20 text-orange-300',
									)}
								>
									SPEND LIMIT: $10
								</span>
							)}
						</div>
						<p className="text-gray-400 text-sm">{provider.description}</p>
					</div>
				</div>
				<Button>
					<TbSettings className="size-6 text-text-secondary/50" />
				</Button>
			</div>
		</div>
	);
}
