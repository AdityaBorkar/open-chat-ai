'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface ComboboxProps {
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	options: { value: string; label: string }[];
	className?: string;
	allowCustom?: boolean;
	onCreateNew?: (value: string) => void;
}

export function Combobox({
	value,
	onValueChange,
	placeholder = 'Select option...',
	searchPlaceholder = 'Search...',
	emptyText = 'No option found.',
	options,
	className,
	allowCustom = false,
	onCreateNew,
}: ComboboxProps) {
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const selectedOption = options.find((option) => option.value === value);

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchValue.toLowerCase()),
	);

	const handleSelect = (selectedValue: string) => {
		if (selectedValue === value) {
			onValueChange?.('');
		} else {
			onValueChange?.(selectedValue);
		}
		setOpen(false);
		setSearchValue('');
	};

	const handleCreateNew = () => {
		if (searchValue.trim() && onCreateNew) {
			onCreateNew(searchValue.trim());
			setOpen(false);
			setSearchValue('');
		}
	};

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger asChild={true}>
				<Button
					aria-expanded={open}
					className={cn('w-[200px] justify-between', className)}
					// role="combobox"
					variant="compact"
				>
					{selectedOption ? selectedOption.label : placeholder}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						onValueChange={setSearchValue}
						placeholder={searchPlaceholder}
						value={searchValue}
					/>
					<CommandList>
						<CommandEmpty>
							<div className="py-2 text-center text-sm">
								{emptyText}
								{allowCustom && searchValue.trim() && (
									<div className="mt-2">
										<Button
											className="text-xs"
											onClick={handleCreateNew}
											variant="compact"
										>
											Create &quot;{searchValue.trim()}&quot;
										</Button>
									</div>
								)}
							</div>
						</CommandEmpty>
						<CommandGroup>
							{filteredOptions.map((option) => (
								<CommandItem
									key={option.value}
									onSelect={handleSelect}
									value={option.value}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === option.value ? 'opacity-100' : 'opacity-0',
										)}
									/>
									{option.label}
								</CommandItem>
							))}
							{allowCustom &&
								searchValue.trim() &&
								!filteredOptions.some(
									(opt) =>
										opt.label.toLowerCase() === searchValue.toLowerCase(),
								) && (
									<CommandItem onSelect={handleCreateNew}>
										<Check className="mr-2 h-4 w-4 opacity-0" />
										Create &quot;{searchValue.trim()}&quot;
									</CommandItem>
								)}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
