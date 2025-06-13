import { useSetAtom } from 'jotai';
import { useState } from 'react';

import { sidebarAtom } from '@/app/(app)/atoms';
import {
	SIDEBAR_DEFAULT_WIDTH,
	SIDEBAR_MAX_WIDTH,
	SIDEBAR_MIN_WIDTH,
} from '@/lib/constants';
import { cn } from '@/lib/utils';

export function ResizeHandle() {
	const setSidebar = useSetAtom(sidebarAtom);
	const [isDragging, setIsDragging] = useState(false);

	const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (!isDragging) return;
		const width = Math.min(
			SIDEBAR_MAX_WIDTH,
			Math.max(SIDEBAR_MIN_WIDTH, e.clientX),
		);
		setSidebar((prev) => ({ ...prev, width }));
	};

	return (
		<button
			aria-label="Resize Sidebar"
			className={cn(
				'group w-4 cursor-ew-resize opacity-0 hover:opacity-25',
				isDragging && 'opacity-50 hover:opacity-50',
			)}
			onDoubleClick={() => {
				const width = SIDEBAR_DEFAULT_WIDTH;
				setSidebar((prev) => ({ ...prev, width }));
			}}
			onMouseDown={(e) => {
				e.preventDefault();
				e.stopPropagation();
				setIsDragging(true);
			}}
			onMouseMove={handleMouseMove}
			onMouseUp={() => {
				setIsDragging(false);
			}}
			tabIndex={-1}
			type="button"
		>
			<div className="mx-auto h-full w-1 cursor-ew-resize bg-text-tertiary transition-all" />
		</button>
	);
}
