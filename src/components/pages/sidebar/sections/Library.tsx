import type { IconType } from 'react-icons/lib';
import {
	TbFileText,
	TbLayoutGrid,
	TbPlus,
	TbRobotFace,
	TbUser,
} from 'react-icons/tb';

import { Link } from '@/components/ui/Link';

export function LibrarySection() {
	// Support Dragging
	// New Folder / New Component
	return (
		<div className="flex flex-1 flex-col pt-4">
			<NavLink href="/projects" icon={TbLayoutGrid}>
				Projects
			</NavLink>
			<NavLink href="/agents" icon={TbRobotFace}>
				Agents
			</NavLink>
			<NavLink href="/prompts" icon={TbFileText}>
				Prompts
			</NavLink>
			<NavLink href="/personas" icon={TbUser}>
				Personas
			</NavLink>
		</div>
	);
}

function NavLink({
	href,
	children,
	icon: Icon,
}: {
	href: string;
	children: React.ReactNode;
	icon: IconType;
}) {
	return (
		<Link
			className="flex flex-row items-center gap-2 rounded-none border-border/50 border-t px-2 py-4 text-text-secondary"
			href={href}
			variant="compact"
		>
			<Icon className="-mt-0.5 size-5" />
			{children}
			<TbPlus className="ml-auto" />
		</Link>
	);
}
