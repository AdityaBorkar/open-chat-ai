import { useRef } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { TbChevronDown } from 'react-icons/tb';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DropdownButtonProps<T extends FieldValues = FieldValues> {
	name: Path<T>;
	value: string;
	options: { label: string; value: string }[];
	onChange: (value: string) => void;
	register?: UseFormRegister<T>;
	className?: string;
	side?: 'top' | 'bottom' | 'left' | 'right';
	buttonLabel?: string;
}

export function DropdownButton<T extends FieldValues = FieldValues>({
	name,
	value,
	options,
	onChange,
	register,
	className,
	side = 'bottom',
	buttonLabel,
}: DropdownButtonProps<T>) {
	const selectedOption = options.find((option) => option.value === value);
	const displayLabel = buttonLabel || selectedOption?.label || value;
	const shadowRef = useRef<HTMLDivElement>(null);

	const handleOptionClick = (optionValue: string) => {
		onChange(optionValue);
	};

	return (
		<>
			{register && <input {...register(name)} type="hidden" value={value} />}
			<DropdownMenu>
				<DropdownMenuTrigger asChild={true}>
					<button
						className={cn(
							'flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-black text-sm transition-all hover:bg-white/90',
							'border border-white/20 backdrop-blur-sm',
							className,
						)}
						style={{
							boxShadow: 'inset 0px 0px 16px 0px rgba(242, 242, 242, 1)',
						}}
						type="button"
					>
						{displayLabel}
						<TbChevronDown className="size-4" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="min-w-[160px] rounded-2xl border border-white/30 bg-white/95 p-2 shadow-lg backdrop-blur-md"
					side={side}
				>
					<div className="" ref={shadowRef} />
					{options.map((option) => (
						<DropdownMenuItem
							className="cursor-pointer rounded-lg px-3 py-2 font-medium text-sm transition-colors hover:bg-black/5 focus:bg-black/5"
							key={option.value}
							onClick={() => handleOptionClick(option.value)}
						>
							{option.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
