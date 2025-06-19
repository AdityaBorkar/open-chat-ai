import { TbArrowUp, TbBulb, TbTelescope, TbWorld } from 'react-icons/tb';

import { ToggleInput } from '@/components/ui/input/toggle';
import { type ConvoFormData, useConvoForm } from '@/hooks/useConvoForm';
import { CONVERSATION_MODES, MODEL_LIST, PERSONA_LIST } from './constants';
import { DropdownButton } from './DropdownButton';

export default function UserInput() {
	const { register, handleSubmit, watch, setValue } = useConvoForm();

	// Watch form values for display
	const selectedMode = watch('mode');
	const selectedModel = watch('model');
	const selectedPersona = watch('persona');
	const thinking = watch('thinking');
	const webSearch = watch('webSearch');
	const research = watch('research');

	const selectedModeLabel = CONVERSATION_MODES.find(
		(m) => m.value === selectedMode,
	)?.label;
	const selectedModelLabel = MODEL_LIST.find(
		(m) => m.value === selectedModel,
	)?.label;
	const selectedPersonaLabel = PERSONA_LIST.find(
		(p) => p.value === selectedPersona,
	)?.label;

	function onSubmit(_data: ConvoFormData) {
		// Handle form submission here
	}

	return (
		<form
			className="relative z-20 mb-8 rounded-[26px] border border-white/20 bg-white/25 p-2 backdrop-blur-2xl"
			onSubmit={handleSubmit(onSubmit)}
			style={{
				boxShadow:
					'0px 0px 11px 0px rgba(0, 0, 0, 0.08), inset -1px -1px 0px 0px rgba(242, 242, 242, 1), inset 1px 1px 0px 0px rgba(242, 242, 242, 1)',
			}}
		>
			<div
				className="relative rounded-[18px] border-2 border-white/50 bg-white/60 backdrop-blur-2xl"
				style={{
					boxShadow:
						'0px 0px 40px 0px rgba(0, 0, 0, 0.12), inset 0px 0px 32.9px 0px rgba(255, 255, 255, 1)',
				}}
			>
				<textarea
					{...register('message')}
					className="peer min-h-24 w-full resize-none border-none bg-transparent p-4 font-medium text-base text-black focus:outline-none"
					placeholder=""
				/>
				<div className="pointer-events-none absolute top-4 left-4 hidden flex-wrap items-center gap-1.5 font-medium text-base peer-placeholder-shown:flex">
					<span className="text-purple-400">{selectedModeLabel}</span>
					<span className="text-gray-500">with</span>
					<span className="text-purple-400">{selectedModelLabel}</span>
					<span className="text-gray-500">as</span>
					<span className="text-purple-400">{selectedPersonaLabel}</span>
				</div>

				<div className="mx-4 mt-2 mb-4 flex items-end justify-between">
					<div className="flex items-center gap-3">
						<DropdownButton<ConvoFormData>
							name="mode"
							onChange={(value) => setValue('mode', value)}
							options={CONVERSATION_MODES}
							register={register}
							value={selectedMode}
						/>
						<DropdownButton<ConvoFormData>
							name="model"
							onChange={(value) => setValue('model', value)}
							options={MODEL_LIST}
							register={register}
							value={selectedModel}
						/>
						<DropdownButton<ConvoFormData>
							name="persona"
							onChange={(value) => setValue('persona', value)}
							options={PERSONA_LIST}
							register={register}
							side="top"
							value={selectedPersona}
						/>
					</div>

					{/* Right side - Action buttons */}
					<div className="flex items-center">
						<ToggleInput<ConvoFormData>
							icon={TbBulb}
							name="thinking"
							onChange={(value) => setValue('thinking', value)}
							register={register}
							value={thinking}
						/>
						<ToggleInput<ConvoFormData>
							icon={TbWorld}
							name="webSearch"
							onChange={(value) => setValue('webSearch', value)}
							register={register}
							value={webSearch}
						/>
						<ToggleInput<ConvoFormData>
							icon={TbTelescope}
							name="research"
							onChange={(value) => setValue('research', value)}
							register={register}
							value={research}
						/>
						<button
							className="ml-2 flex size-8 items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-700"
							type="submit"
						>
							<TbArrowUp className="size-5" />
						</button>
					</div>
				</div>
			</div>
		</form>
	);
}
