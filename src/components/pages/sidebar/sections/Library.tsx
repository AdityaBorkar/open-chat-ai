import type { IconType } from 'react-icons/lib';
import { TbFileText, TbLayoutGrid, TbPlus, TbUser } from 'react-icons/tb';

import { Link } from '@/components/ui/Link';

export function LibrarySection() {
	// Support Dragging
	// New Folder / New Component
	return (
		<div className="flex flex-1 flex-col gap-1 pt-4">
			<hr />
			<NavLink href="/projects" icon={TbLayoutGrid}>
				Projects
			</NavLink>
			<hr />
			{/* <NavLink href="/agents" icon={TbRobotFace}>
				Agents
			</NavLink> */}
			<NavLink href="/prompts" icon={TbFileText}>
				Prompts
			</NavLink>
			<hr />
			<NavLink href="/personas" icon={TbUser}>
				Personas
			</NavLink>
			<hr />
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
			className="flex flex-row items-center gap-2 rounded-none px-2 py-3 text-text-secondary"
			href={href}
			variant="compact"
		>
			<Icon className="-mt-0.5 size-5" />
			{children}
			<TbPlus className="ml-auto" />
		</Link>
	);
}
