'use client';

// import { useState, useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
	// TODO: Auth & Connect to Local Database / Add a Loading Screen
	// const [isLoading, setIsLoading] = useState(true);

	// useEffect(() => {
	// 	setIsLoading(false);
	// }, []);

	// if (isLoading) return <div>Loading...</div>;
	return (
		<div>
			{children}
			{/* <div className="fixed top-0 left-0 h-screen w-screen bg-bg-primary/50 backdrop-blur-sm">
				Shortcuts

				Customize Send / Draft Send / Multiline

				Onboard as a Power User
				Onboard as a Simple User
			</div> */}
		</div>
	);
}
