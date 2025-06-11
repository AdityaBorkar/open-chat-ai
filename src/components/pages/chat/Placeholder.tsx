import { MessageSquare } from 'lucide-react';

export default function Placeholder() {
	return (
		<div className="flex h-full items-center justify-center">
			<div className="text-center">
				<MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
			</div>
		</div>
	);
}
