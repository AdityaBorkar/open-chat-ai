import Section from '@/components/pages/settings/Section';
import { Button } from '@/components/ui/Button';

export default function ShortcutsPage() {
	// Edit Shortcuts

	// CTRL + / = Change Model
	// CTRL + K = Search
	// CTRL + B = Hide Sidebar
	// CTRL + P / CTRL + SHIFT + P = Print Dialog
	return (
		<div>
			<Section caption="Customize Chat" title="Customize Chat">
				<div>What should Chat call you?</div>
				<div>What do you do?</div>
				<div>
					What traits should T3 Chat have?(up to 50, max 100 chars each)
				</div>
				<div>Anything else T3 Chat should know about you?</div>
			</Section>

			<Section caption="Chat Memory" title="Chat Memory">
				<div>Enable Memory</div>
				<div>
					Chat Memory is a feature that allows you to store and retrieve
					information from previous conversations.
				</div>
				<div>Write Memory TExt Here</div>
				<Button>Clear Memory</Button>
			</Section>

			<Section caption="Keyboard Shortcuts" title="Keyboard Shortcuts">
				<div>
					<div>CTRL + / = Change Model</div>
					<div>CTRL + K = Search</div>
					<div>CTRL + B = Hide Sidebar</div>
					<div>CTRL + P / CTRL + SHIFT + P = Print Dialog</div>
				</div>
			</Section>

			<Section caption="Visual Options" title="Visual Options">
				<div>
					<div>Add ShadCN Mod</div>
					<div>Hide Personal Information</div>
					<div>Stats for Nerds</div>
					{/* - Implement Notifications & Sound Indicators when a chat response is completed. */}
				</div>
			</Section>

			<Section caption="Chat Components" title="Chat Components">
				<div>
					<div>Code Blocks</div>
					<div>Tables</div>
					<div>Images</div>
				</div>
			</Section>
		</div>
	);
}

// Attach Image & PDF
// Reasoning
// Search

// OpenRouter
// GoogleAI
// OpenAI
// Anthropic
// Mistral
