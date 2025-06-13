export default function ProjectsPage() {
	// Store all your context at one place and use them at a click. You can
	// reference project in any prompt using @ directive. It will attach all of
	// the following: (@ / # / ! / /)
	return (
		<div className="h-full">
			<div className="border-border/50 border-b px-4 py-2.5">
				Project Name - Share (Download), Delete
			</div>

			<div className="flex h-full flex-row gap-1">
				<div className="flex h-full flex-col gap-1 border-border/50 border-r px-2 py-4">
					<NavLink>MCPs</NavLink>
					<NavLink>Connections</NavLink>
					<NavLink>Notes</NavLink>
					<NavLink>Conversations</NavLink>
					<NavLink>Add Attachments</NavLink>
					<NavLink>Add UI Components</NavLink>
					<hr />
					<NavLink>Referenced Conversations</NavLink>
					<NavLink>Referenced Agents</NavLink>
				</div>
				<div>CHILDREN</div>
			</div>
		</div>
	);
}

function NavLink({ children }: { children: React.ReactNode }) {
	return (
		<div className="rounded-full border border-transparent px-4 py-2 hover:border-border/50 hover:bg-bg-secondary">
			{children}
		</div>
	);
}
