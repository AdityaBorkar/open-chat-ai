import type { IconType } from 'react-icons';
import { TbLifebuoy, TbRocket, TbSparkles } from 'react-icons/tb';

import { Button } from '@/components/ui/Button';
import { PRO_PLAN } from '@/lib/constants';

export function UpgradeSection() {
	return (
		<section>
			<div className="mt-2 mb-6 flex items-start justify-between font-bold text-2xl text-white">
				<h2>Upgrade to Pro</h2>
				<div>
					${PRO_PLAN.monthly_price}
					<span className="font-normal text-base text-text-tertiary">
						/month
					</span>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<UpgradeBenefitsCard
					description="Get access to our full suite of models including Claude, o3-mini-high, and more!"
					icon={TbRocket}
					title="Access to All Models"
				/>
				<UpgradeBenefitsCard
					description={`Receive ${PRO_PLAN.std_credits} standard credits per month, plus ${PRO_PLAN.premium_credits} premium credits* per month.`}
					icon={TbSparkles}
					title="Generous Limits"
				/>
				<UpgradeBenefitsCard
					description="Get faster responses and dedicated assistance from the T3 team whenever you need help!"
					icon={TbLifebuoy}
					title="Priority Support"
				/>
			</div>

			<div className="mt-6 mb-12">
				<Button type="button" variant="hero">
					Upgrade Now
				</Button>
			</div>

			<p className="font-medium text-sm text-text-tertiary/50 leading-relaxed">
				* Premium credits are used for GPT Image Gen, Claude Sonnet, and Grok 3.
				<br />* Additional Premium credits can be purchased separately.
			</p>
		</section>
	);
}

function UpgradeBenefitsCard({
	title,
	description,
	icon: Icon,
}: {
	title: string;
	description: string;
	icon: IconType;
}) {
	return (
		<div className="rounded-xl border border-border/50 bg-bg-primary px-6 py-4">
			<div className="mb-2 flex items-center gap-2">
				<Icon className="size-6 stroke-1" />
				<span className="font-semibold text-lg text-white ">{title}</span>
			</div>
			<p className="text-pretty font-medium text-gray-400 text-sm leading-relaxed">
				{description}
			</p>
		</div>
	);
}
