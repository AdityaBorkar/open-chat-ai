import { MessageSquare } from 'lucide-react';

export default function Placeholder() {
	return (
		<div className="flex h-full items-center justify-center">
			<div className="text-center">
				<MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
				<p className="text-gray-400 text-sm">
					Start a new conversation to get started
				</p>

				<div>Chat Suggestions</div>
			</div>
		</div>
	);
}
