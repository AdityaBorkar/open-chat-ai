import { Button } from '@/components/ui/Button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

export default function ApiKeyNotConfigured() {
	// TODO: Set Spend Limit

	const validationError = '';
	return (
		<div>
			<div className="mx-auto w-lg rounded-lg border border-border p-4 text-center">
				<div>
					&quot;Gemini 2.5 Pro&quot; requires an API Key to be configured.
				</div>
				<div className="mt-12 flex flex-row gap-2">
					<div>
						Switch Model (open model picker)
						{/* (Model Picker) */}
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button>Connect API Key (open dialog)</Button>
						</DialogTrigger>
						<DialogContent className="w-84 rounded-4xl">
							<DialogHeader>
								<DialogTitle>Connect API Key</DialogTitle>
								<DialogDescription>
									You can connect your API Key from any of the following
									providers:
								</DialogDescription>
							</DialogHeader>
							<div className="flex flex-col gap-2">
								<Button>Google</Button>
								<Button>OpenRouter</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>
				<div>{/* Show Options - Google / OpenRouter */}</div>
			</div>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Connect using OpenRouter</Button>
				</DialogTrigger>
				<DialogContent className="w-84 rounded-4xl">
					<DialogHeader>
						<DialogTitle>Connect to OpenRouter</DialogTitle>
						<DialogDescription>
							Your API Key shall securely be stored on your device.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-2">
						<Button
							className="w-full"
							// onClick={handleLinkOAuth}
							variant="shadow"
						>
							Link OpenRouter via OAuth
						</Button>
						<Button
							className="w-full"
							// onClick={handleLinkOAuth}
							variant="shadow"
						>
							Configure API Key
							{/* <div className="flex flex-col space-y-2">
							<input
								className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
								// onChange={(e) => setApiKey(e.target.value)}
								placeholder="Enter API Key"
								type="text"
								// value={apiKey}
							/>
							<Button
								className="w-full"
								// onClick={handleValidateApiKey}
								variant="default"
							>
								Validate API Key
							</Button>
						</div> */}
						</Button>
					</div>
					{validationError && (
						<p className="text-red-500 text-sm">{validationError}</p>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
