export default function TypingIndicator() {
	return (
		<div className="flex justify-start">
			<div className="max-w-xs rounded-lg px-4 py-3">
				<div className="flex space-x-1.5">
					<div className="h-2 w-2 animate-bounce rounded-full bg-pink-400/50" />
					<div
						className="h-2 w-2 animate-bounce rounded-full bg-pink-400/50"
						style={{ animationDelay: '0.1s' }}
					/>
					<div
						className="h-2 w-2 animate-bounce rounded-full bg-pink-400/50"
						style={{ animationDelay: '0.2s' }}
					/>
				</div>
			</div>
		</div>
	);
}
