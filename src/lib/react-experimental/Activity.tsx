export default function Activity({
	children,
	mode,
}: {
	children: React.ReactNode;
	mode: 'visible' | 'hidden';
}) {
	return (
		<div className={mode === 'visible' ? 'visible' : 'hidden'}>{children}</div>
	);
}
