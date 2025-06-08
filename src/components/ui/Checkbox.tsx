import type React from 'react';

import { cn } from '@/lib/utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
	return (
		<div className="flex items-center space-x-2">
			<input
				className={cn(
					'h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500',
					className,
				)}
				id={id}
				type="checkbox"
				{...props}
			/>
			{label && (
				<label className="text-sm text-text-secondary" htmlFor={id}>
					{label}
				</label>
			)}
		</div>
	);
}
