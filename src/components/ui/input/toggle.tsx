import { useState } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface ToggleInputProps<T extends FieldValues = FieldValues> {
	className?: string;
	defaultValue?: boolean;
	icon: React.ElementType;
	name: Path<T>;
	register?: UseFormRegister<T>;
	value?: boolean;
	onChange?: (value: boolean) => void;
}

export function ToggleInput<T extends FieldValues = FieldValues>({
	icon: Icon,
	name,
	defaultValue = false,
	register,
	value,
	onChange,
	className,
}: ToggleInputProps<T>) {
	const [isToggled, setIsToggled] = useState(defaultValue);
	const currentValue = value !== undefined ? value : isToggled;

	const handleToggle = () => {
		const newValue = !currentValue;
		setIsToggled(newValue);
		onChange?.(newValue);
	};

	return (
		<div className="relative">
			{register && (
				<input
					{...register(name)}
					checked={currentValue}
					className="sr-only"
					onChange={handleToggle}
					type="checkbox"
				/>
			)}
			<button
				className={`flex size-10 items-center justify-center rounded-full transition-colors ${
					currentValue
						? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
						: 'text-neutral-600 hover:bg-white/20'
				} ${className}`}
				onClick={handleToggle}
				type="button"
			>
				<Icon className="size-5" />
			</button>
		</div>
	);
}
