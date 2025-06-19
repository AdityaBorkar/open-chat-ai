'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TbArrowDown } from 'react-icons/tb';

interface ScrollToBottomProps {
	messagesEndRef: React.RefObject<HTMLDivElement | null>;
	className?: string;
}

export default function ScrollToBottom({
	messagesEndRef,
	className = '',
}: ScrollToBottomProps) {
	const [isVisible, setIsVisible] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
		});
	}, [messagesEndRef]);

	const checkScrollPosition = useCallback(() => {
		// Clear existing timeout to debounce scroll events
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			const scrollElement = document.documentElement;
			const scrollHeight = scrollElement.scrollHeight;
			const scrollTop = scrollElement.scrollTop;
			const clientHeight = scrollElement.clientHeight;

			// Consider "at bottom" if within 100px of the bottom
			const threshold = 100;
			const isAtBottom = scrollHeight - scrollTop - clientHeight < threshold;

			setIsVisible(!isAtBottom);
		}, 16); // ~60fps throttling
	}, []);

	useEffect(() => {
		// Initial check
		checkScrollPosition();

		// Add scroll listener
		window.addEventListener('scroll', checkScrollPosition, { passive: true });
		window.addEventListener('resize', checkScrollPosition, { passive: true });

		return () => {
			window.removeEventListener('scroll', checkScrollPosition);
			window.removeEventListener('resize', checkScrollPosition);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [checkScrollPosition]);

	return (
		<motion.button
			animate={{
				opacity: isVisible ? 1 : 0,
				scale: isVisible ? 1 : 0.95,
				y: isVisible ? 0 : 10,
			}}
			className={`block w-fit rounded-full border border-border/10 bg-bg-secondary/20 px-4 py-2 text-center text-sm text-text-secondary backdrop-blur-sm hover:bg-bg-secondary/30 ${className}`}
			initial={{ opacity: 0, scale: 0.95, y: 10 }}
			onClick={scrollToBottom}
			style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
			transition={{
				duration: 0.2,
				ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
			}}
			type="button"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.98 }}
		>
			<TbArrowDown className="-mt-1 mr-1 inline-block size-4" />
			Scroll to bottom
		</motion.button>
	);
}
