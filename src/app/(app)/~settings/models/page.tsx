'use client';

import {
	IconBrain,
	IconCards,
	IconChartBar,
	IconCode,
	IconLanguage,
	IconMath,
	IconStar,
	IconTable,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import models from '@/lib/constants/models.json';

// Enhanced model data with AI benchmarks
const enhancedModels = models.map((model) => ({
	...model,
	benchmarks: {
		coding: Math.floor(Math.random() * 40) + 60, // 60-100
		creative: Math.floor(Math.random() * 40) + 60,
		language: Math.floor(Math.random() * 40) + 60,
		mathematics: Math.floor(Math.random() * 40) + 60,
		reasoning: Math.floor(Math.random() * 40) + 60,
	},
	overall: Math.floor(Math.random() * 30) + 70, // 70-100
	pricePerMToken:
		model.type === 'premium'
			? (Math.random() * 15 + 5).toFixed(2)
			: (Math.random() * 3 + 0.5).toFixed(2),
	tokensPerSecond: Math.floor(Math.random() * 80) + 20,
}));

type ViewMode = 'cards' | 'table';

interface BenchmarkIconProps {
	type: keyof (typeof enhancedModels)[0]['benchmarks'];
	className?: string;
}

const BenchmarkIcon = ({ type, className }: BenchmarkIconProps) => {
	const icons = {
		coding: IconCode,
		creative: IconStar,
		language: IconLanguage,
		mathematics: IconMath,
		reasoning: IconBrain,
	};
	const Icon = icons[type];
	return <Icon className={className} size={16} />;
};

const ScoreBadge = ({ score }: { score: number }) => (
	<span
		className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
			score >= 90
				? 'bg-green-500/20 text-green-300'
				: score >= 80
					? 'bg-blue-500/20 text-blue-300'
					: score >= 70
						? 'bg-yellow-500/20 text-yellow-300'
						: 'bg-red-500/20 text-red-300'
		}`}
	>
		{score}
	</span>
);

interface ModelCardsProps {
	models: typeof enhancedModels;
	selectedModel: string;
	showBenchmarks: boolean;
	onModelSelect: (modelId: string) => void;
}

const ModelCards = ({
	models,
	selectedModel,
	showBenchmarks,
	onModelSelect,
}: ModelCardsProps) => (
	<div className="space-y-3">
		{models.map((model) => (
			<button
				className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
					selectedModel === model.name.toLowerCase().replace(/\s+/g, '-')
						? 'border-pink-500 bg-bg-secondary'
						: 'border-border-primary bg-bg-primary hover:border-border-secondary'
				}`}
				key={model.name}
				onClick={() =>
					onModelSelect(model.name.toLowerCase().replace(/\s+/g, '-'))
				}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						onModelSelect(model.name.toLowerCase().replace(/\s+/g, '-'));
					}
				}}
				type="button"
			>
				{/* <button className="mb-3 flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div>
							<h3 className="font-semibold text-text-primary">{model.name}</h3>
							<p className="text-text-tertiary text-xs">{model.provider}</p>
						</div>
						<span
							className={`rounded-full px-2 py-1 font-medium text-xs ${
								model.type === 'premium'
									? 'bg-pink-500/20 text-pink-300'
									: 'bg-gray-600/50 text-gray-300'
							}`}
						>
							{model.type}
						</span>
						<ScoreBadge score={model.overall} />
					</div>
					<div className="text-right text-text-tertiary text-xs">
						<div>${model.pricePerMToken}/1M tokens</div>
						<div>{model.tokensPerSecond} tok/s</div>
					</div>
				</button> */}

				<p className="mb-3 text-text-secondary text-xs">{model.description}</p>

				{showBenchmarks && (
					<div className="mb-3 grid grid-cols-5 gap-2">
						{Object.entries(model.benchmarks).map(([key, score]) => (
							<div className="text-center" key={key}>
								<div className="mb-1 flex items-center justify-center">
									<BenchmarkIcon
										className="text-text-tertiary"
										type={key as keyof typeof model.benchmarks}
									/>
								</div>
								<div className="text-text-tertiary text-xs capitalize">
									{key}
								</div>
								<ScoreBadge score={score} />
							</div>
						))}
					</div>
				)}

				<div className="flex flex-wrap gap-1">
					{model.features.map((feature) => (
						<span
							className="rounded-full bg-bg-tertiary px-2 py-1 text-text-tertiary text-xs"
							key={feature}
						>
							{feature}
						</span>
					))}
				</div>
			</button>
		))}
	</div>
);

interface ModelTableProps {
	models: typeof enhancedModels;
	selectedModel: string;
	showBenchmarks: boolean;
	onModelSelect: (modelId: string) => void;
}

const ModelTable = ({
	models,
	selectedModel,
	showBenchmarks,
	onModelSelect,
}: ModelTableProps) => (
	<div className="overflow-hidden rounded-lg border border-border-primary">
		<table className="w-full">
			<thead className="border-border-primary border-b bg-bg-secondary">
				<tr>
					<th className="p-3 text-left font-medium text-text-primary text-xs">
						Model
					</th>
					<th className="p-3 text-left font-medium text-text-primary text-xs">
						Provider
					</th>
					<th className="p-3 text-left font-medium text-text-primary text-xs">
						Type
					</th>
					<th className="p-3 text-left font-medium text-text-primary text-xs">
						Score
					</th>
					{showBenchmarks && (
						<>
							<th className="p-3 text-center font-medium text-text-primary text-xs">
								<BenchmarkIcon className="mx-auto" type="reasoning" />
							</th>
							<th className="p-3 text-center font-medium text-text-primary text-xs">
								<BenchmarkIcon className="mx-auto" type="coding" />
							</th>
							<th className="p-3 text-center font-medium text-text-primary text-xs">
								<BenchmarkIcon className="mx-auto" type="mathematics" />
							</th>
							<th className="p-3 text-center font-medium text-text-primary text-xs">
								<BenchmarkIcon className="mx-auto" type="language" />
							</th>
							<th className="p-3 text-center font-medium text-text-primary text-xs">
								<BenchmarkIcon className="mx-auto" type="creative" />
							</th>
						</>
					)}
					<th className="p-3 text-left font-medium text-text-primary text-xs">
						Price
					</th>
					<th className="p-3 text-left font-medium text-text-primary text-xs">
						Speed
					</th>
				</tr>
			</thead>
			<tbody>
				{models.map((model, index) => (
					<tr
						className={`cursor-pointer border-border-secondary border-b transition-colors ${
							selectedModel === model.name.toLowerCase().replace(/\s+/g, '-')
								? 'bg-bg-secondary'
								: 'hover:bg-bg-secondary/50'
						} ${index === models.length - 1 ? 'border-b-0' : ''}`}
						key={model.name}
						onClick={() =>
							onModelSelect(model.name.toLowerCase().replace(/\s+/g, '-'))
						}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onModelSelect(model.name.toLowerCase().replace(/\s+/g, '-'));
							}
						}}
					>
						<td className="p-3">
							<div className="font-medium text-sm text-text-primary">
								{model.name}
							</div>
							<div className="text-text-tertiary text-xs">
								{model.description}
							</div>
						</td>
						<td className="p-3 text-sm text-text-secondary">
							{model.provider}
						</td>
						<td className="p-3">
							<span
								className={`rounded-full px-2 py-1 font-medium text-xs ${
									model.type === 'premium'
										? 'bg-pink-500/20 text-pink-300'
										: 'bg-gray-600/50 text-gray-300'
								}`}
							>
								{model.type}
							</span>
						</td>
						<td className="p-3">
							<ScoreBadge score={model.overall} />
						</td>
						{showBenchmarks && (
							<>
								<td className="p-3 text-center">
									<ScoreBadge score={model.benchmarks.reasoning} />
								</td>
								<td className="p-3 text-center">
									<ScoreBadge score={model.benchmarks.coding} />
								</td>
								<td className="p-3 text-center">
									<ScoreBadge score={model.benchmarks.mathematics} />
								</td>
								<td className="p-3 text-center">
									<ScoreBadge score={model.benchmarks.language} />
								</td>
								<td className="p-3 text-center">
									<ScoreBadge score={model.benchmarks.creative} />
								</td>
							</>
						)}
						<td className="p-3 text-sm text-text-secondary">
							${model.pricePerMToken}/1M
						</td>
						<td className="p-3 text-sm text-text-secondary">
							{model.tokensPerSecond} tok/s
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export default function ModelsPage() {
	const [selectedModel, setSelectedModel] =
		useState<string>('claude-3.5-sonnet');
	const [viewMode, setViewMode] = useState<ViewMode>('cards');
	const [showBenchmarks, setShowBenchmarks] = useState(false);
	const [temperature, setTemperature] = useState(0.7);

	const sortedModels = useMemo(
		() => [...enhancedModels].sort((a, b) => b.overall - a.overall),
		[],
	);

	const handleModelSelect = (modelId: string) => {
		setSelectedModel(modelId);
	};

	// TODO: Search URL, Default Model, Remove Price

	return (
		<div className="max-w-6xl">
			{/* Header */}
			<div className="mb-6">
				<h1 className="mb-2 font-bold text-2xl text-text-primary">Models</h1>
				<p className="text-sm text-text-secondary">
					Configure and select AI models for your conversations.
				</p>
			</div>

			<div>Also View Local Models</div>
			<div>Is MCP available?</div>
			<div>Copy Search Params & Setup Search Engine support</div>

			{/* Controls */}
			<div className="mb-6 flex items-center justify-between rounded-lg border border-border-primary bg-bg-secondary p-4">
				<div className="flex items-center gap-4">
					{/* View Toggle */}
					<div className="flex items-center rounded-lg border border-border-primary bg-bg-primary p-1">
						<button
							className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
								viewMode === 'cards'
									? 'bg-pink-600 text-white'
									: 'text-text-tertiary hover:text-text-primary'
							}`}
							onClick={() => setViewMode('cards')}
							type="button"
						>
							<IconCards size={16} />
							Cards
						</button>
						<button
							className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
								viewMode === 'table'
									? 'bg-pink-600 text-white'
									: 'text-text-tertiary hover:text-text-primary'
							}`}
							onClick={() => setViewMode('table')}
							type="button"
						>
							<IconTable size={16} />
							Table
						</button>
					</div>

					{/* Benchmarks Toggle */}
					<button
						className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
							showBenchmarks
								? 'border-pink-600 bg-pink-600 text-white'
								: 'border-border-primary bg-bg-primary text-text-tertiary hover:text-text-primary'
						}`}
						onClick={() => setShowBenchmarks(!showBenchmarks)}
					>
						<IconChartBar size={16} />
						AI Benchmarks
					</button>
				</div>
			</div>

			{/* Models Display */}
			<div className="mb-6">
				{viewMode === 'cards' ? (
					<ModelCards
						models={sortedModels}
						onModelSelect={handleModelSelect}
						selectedModel={selectedModel}
						showBenchmarks={showBenchmarks}
					/>
				) : (
					<ModelTable
						models={sortedModels}
						onModelSelect={handleModelSelect}
						selectedModel={selectedModel}
						showBenchmarks={showBenchmarks}
					/>
				)}
			</div>

			{/* Model Settings */}
			<div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
				<h2 className="mb-4 font-semibold text-text-primary">Model Settings</h2>

				<div className="space-y-4">
					<div>
						<label
							className="mb-2 block font-medium text-sm text-text-primary"
							htmlFor="temperature-slider"
						>
							Temperature: {temperature}
						</label>
						<p className="mb-3 text-text-tertiary text-xs">
							Controls randomness in responses (0 = focused, 1 = creative)
						</p>
						<input
							className="w-full accent-pink-600"
							id="temperature-slider"
							max="1"
							min="0"
							onChange={(e) => setTemperature(Number(e.target.value))}
							step="0.1"
							type="range"
							value={temperature}
						/>
						<div className="mt-1 flex justify-between text-text-tertiary text-xs">
							<span>0 (Focused)</span>
							<span>1 (Creative)</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
