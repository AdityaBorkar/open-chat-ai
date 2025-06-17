import type { IconType } from 'react-icons';
import { TbChevronDown } from 'react-icons/tb';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Dropdown({
	defaultValue,
	items,
	onSelect,
}: {
	defaultValue: string;
	items: {
		icon: IconType;
		label: string;
		value: string;
	}[];
	onSelect?: (value: string) => void;
}) {
	const defaultItem = items.find((item) => item.value === defaultValue);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className="flex w-fit items-center rounded-full border border-border/10 bg-bg-secondary px-4 py-2 font-semibold text-text-primary hover:bg-bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					style={{ boxShadow: '0px 0px 16px 0px #F2F2F2 inset' }}
					type="button"
				>
					{defaultItem?.icon && (
						<defaultItem.icon className="-mt-0.5 mr-2 inline-block size-4" />
					)}
					{defaultItem?.label}
					<TbChevronDown className="-mt-0.5 ml-1 inline-block h-5 w-auto" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				className="w-fit rounded-lg border border-border/10 bg-bg-secondary p-2 backdrop-blur-md"
			>
				{items.map((item) => (
					<DropdownMenuItem
						className="flex cursor-pointer items-center rounded px-2 py-1.5 font-medium hover:bg-bg-primary/5 focus:bg-bg-primary/5"
						key={item.value}
						onClick={() => onSelect?.(item.value)}
					>
						{item.icon && <item.icon className="inline-block h-4 w-auto" />}
						{item.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
