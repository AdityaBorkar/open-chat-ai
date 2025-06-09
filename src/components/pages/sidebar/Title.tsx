export default function Title({ children }: { children: React.ReactNode }) {
	return (
		<div className="mt-8 mb-2 w-full px-4 text-sm text-text-tertiary/50">
			{children}
		</div>
	);
}
