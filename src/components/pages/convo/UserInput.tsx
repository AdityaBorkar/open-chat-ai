import { useState } from 'react';
import {
	TbArrowUp,
	TbBulb,
	TbChevronDown,
	TbGlobe,
	TbMicrophone,
	TbPaperclip,
} from 'react-icons/tb';

import { cn } from '@/lib/utils';

const CONVERSATION_MODES = [
	{ label: 'Chat', value: 'chat' },
	{ label: 'Generate', value: 'generate' },
	{ label: 'Talk', value: 'talk' },
	{ label: 'Assist', value: 'assist' },
];

const MODEL_LIST = [
	{ label: 'Gemini 4.0', value: 'gemini-4.0' },
	{ label: 'Gemini 2.5 Pro (Exp)', value: 'gemini-2.5-pro-exp' },
	{ label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
];

const PERSONA_LIST = [
	{ label: 'Chatbot', value: 'chatbot' },
	{ label: 'Doctor', value: 'doctor' },
	{ label: 'Professor', value: 'professor' },
	{ label: 'Philosopher', value: 'philosopher' },
];

interface DropdownButtonProps {
	value: string;
	options: Array<{ label: string; value: string }>;
	onChange: (value: string) => void;
	className?: string;
}

function DropdownButton({
	value,
	options,
	onChange,
	className,
}: DropdownButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const selectedOption = options.find((opt) => opt.value === value);

	return (
		<div className="relative">
			<button
				className={cn(
					'flex items-center gap-1 rounded-full bg-white px-4 py-2 font-semibold text-base text-black',
					'border border-white/20 backdrop-blur-sm',
					className,
				)}
				onClick={() => setIsOpen(!isOpen)}
				style={{
					boxShadow: 'inset 0px 0px 16px 0px rgba(242, 242, 242, 1)',
				}}
				type="button"
			>
				{selectedOption?.label}
				<TbChevronDown className="size-6" />
			</button>
			{isOpen && (
				<div className="absolute top-full left-0 z-10 mt-2 min-w-full rounded-2xl border border-white/30 bg-white/75 p-2.5 shadow-lg backdrop-blur-md">
					{options.map((option) => (
						<button
							className={cn(
								'w-full rounded-lg px-1.5 py-2 text-left font-medium text-base',
								value === option.value
									? 'bg-black/5 text-black'
									: 'text-black hover:bg-black/5',
							)}
							key={option.value}
							onClick={() => {
								onChange(option.value);
								setIsOpen(false);
							}}
							type="button"
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

interface ToggleButtonProps {
	active?: boolean;
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
}

function ToggleButton({
	active = false,
	onClick,
	children,
	className,
}: ToggleButtonProps) {
	return (
		<button
			className={cn(
				'flex size-12 items-center justify-center rounded-full transition-colors',
				active
					? 'text-purple-700'
					: 'bg-transparent text-neutral-600 hover:bg-white/20',
				className,
			)}
			onClick={onClick}
			type="button"
		>
			{children}
		</button>
	);
}

export default function UserInput() {
	const isLoading = false;
	const [selectedMode, setSelectedMode] = useState('chat');
	const [selectedModel, setSelectedModel] = useState('gemini-4.0');
	const [selectedPersona, setSelectedPersona] = useState('chatbot');
	const [inputMessage, setInputMessage] = useState('');

	// Toggle states
	const [lightbulbActive, setLightbulbActive] = useState(true);
	const [globeActive, setGlobeActive] = useState(false);
	const [attachActive, setAttachActive] = useState(true);
	const [micActive, setMicActive] = useState(true);

	const selectedModeLabel = CONVERSATION_MODES.find(
		(m) => m.value === selectedMode,
	)?.label;
	const selectedModelLabel = MODEL_LIST.find(
		(m) => m.value === selectedModel,
	)?.label;
	const selectedPersonaLabel = PERSONA_LIST.find(
		(p) => p.value === selectedPersona,
	)?.label;

	const [showPlaceholder, setShowPlaceholder] = useState(false);

	return (
		<div
			className="relative z-20 mb-8 rounded-[26px] border border-white/20 p-2 backdrop-blur-2xl"
			style={{
				background: 'rgba(255, 255, 255, 0.24)',
				boxShadow:
					'0px 0px 11px 0px rgba(0, 0, 0, 0.08), inset -1px -1px 0px 0px rgba(242, 242, 242, 1), inset 1px 1px 0px 0px rgba(242, 242, 242, 1)',
			}}
		>
			<div
				className="rounded-[18px] border-[3px] border-white/50 bg-white/60 p-4 backdrop-blur-2xl"
				style={{
					background: 'rgba(255, 255, 255, 0.6)',
					boxShadow:
						'0px 0px 40px 0px rgba(0, 0, 0, 0.12), inset 0px 0px 32.9px 0px rgba(255, 255, 255, 1)',
				}}
			>
				{showPlaceholder && (
					<div className="mb-4 flex flex-wrap items-center gap-1.5 font-medium text-base">
						<span className="text-purple-400">{selectedModeLabel}</span>
						<span className="text-gray-500">with</span>
						<span className="text-purple-400">{selectedModelLabel}</span>
						<span className="text-gray-500">as</span>
						<span className="text-purple-400">{selectedPersonaLabel}</span>
					</div>
				)}

				<div className="flex items-end justify-between">
					<div className="flex items-center gap-3">
						<DropdownButton
							onChange={setSelectedMode}
							options={CONVERSATION_MODES}
							value={selectedMode}
						/>
						<DropdownButton
							onChange={setSelectedModel}
							options={MODEL_LIST}
							value={selectedModel}
						/>
						<DropdownButton
							onChange={setSelectedPersona}
							options={PERSONA_LIST}
							value={selectedPersona}
						/>
					</div>

					{/* Right side - Action buttons */}
					<div className="flex items-center gap-1.5">
						<div className="flex items-center">
							<ToggleButton
								active={lightbulbActive}
								onClick={() => setLightbulbActive(!lightbulbActive)}
							>
								<TbBulb className="size-5" />
							</ToggleButton>
							<ToggleButton
								active={globeActive}
								onClick={() => setGlobeActive(!globeActive)}
							>
								<TbGlobe className="size-5" />
							</ToggleButton>
							<ToggleButton
								active={attachActive}
								onClick={() => setAttachActive(!attachActive)}
							>
								<TbPaperclip className="size-5" />
							</ToggleButton>
							<ToggleButton
								active={micActive}
								onClick={() => setMicActive(!micActive)}
							>
								<TbMicrophone className="size-5" />
							</ToggleButton>
						</div>
						<button
							className="ml-1.5 flex size-12 items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-700"
							type="button"
						>
							<TbArrowUp className="size-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
