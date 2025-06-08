export default function Section({
	children,
	title,
	caption,
}: {
	children: React.ReactNode;
	title: string;
	caption: string;
}) {
	return (
		<section>
			<h2 className="mb-4 font-bold text-2xl text-text-primary">{title}</h2>
			<div className="mb-6 text-text-secondary">{caption}</div>

			{children}
		</section>
	);
}
