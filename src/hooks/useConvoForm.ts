import { useForm } from 'react-hook-form';

export interface ConvoFormData {
	message: string;
	mode: string;
	model: string;
	persona: string;
	thinking: boolean;
	webSearch: boolean;
	research: boolean;
}

export interface ConvoFormHelpers {
	register: ReturnType<typeof useForm<ConvoFormData>>['register'];
	handleSubmit: ReturnType<typeof useForm<ConvoFormData>>['handleSubmit'];
	setValue: ReturnType<typeof useForm<ConvoFormData>>['setValue'];
	watch: ReturnType<typeof useForm<ConvoFormData>>['watch'];
	control: ReturnType<typeof useForm<ConvoFormData>>['control'];
	formState: ReturnType<typeof useForm<ConvoFormData>>['formState'];
	getValues: ReturnType<typeof useForm<ConvoFormData>>['getValues'];
	reset: ReturnType<typeof useForm<ConvoFormData>>['reset'];
}

export function useConvoForm(
	defaultValues?: Partial<ConvoFormData>,
): ConvoFormHelpers {
	const form = useForm<ConvoFormData>({
		defaultValues: {
			message: '',
			mode: 'chat',
			model: 'gemini-4.0',
			persona: 'chatbot',
			research: false,
			thinking: true,
			webSearch: false,
			...defaultValues,
		},
	});

	return {
		control: form.control,
		formState: form.formState,
		getValues: form.getValues,
		handleSubmit: form.handleSubmit,
		register: form.register,
		reset: form.reset,
		setValue: form.setValue,
		watch: form.watch,
	};
}
