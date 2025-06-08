'use client';

// import { useState, useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	// TODO: Auth & Connect to Local Database / Add a Loading Screen
	// const [isLoading, setIsLoading] = useState(true);

	// useEffect(() => {
	// 	setIsLoading(false);
	// }, []);

	// if (isLoading) return <div>Loading...</div>;
	return <div>{children}</div>;
}
