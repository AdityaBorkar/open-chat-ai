'use client';

import Link from 'next/link';
import { useId } from 'react';

export default function ContactPage() {
	const nameId = useId();
	const emailId = useId();
	const subjectId = useId();
	const messageId = useId();
	const includeLogsId = useId();

	return (
		<div className="max-w-4xl">
			<div className="mb-8">
				<h1 className="mb-2 font-bold text-3xl text-white">Contact Us</h1>
				<p className="text-gray-400">
					Get help, report issues, or share feedback with the T3 team.
				</p>
			</div>

			{/* Contact Form */}
			<div className="mb-8 rounded-lg bg-gray-800 p-6">
				<h2 className="mb-4 font-semibold text-white text-xl">
					Shameless Plug - Aditya Borkar is open to work!
				</h2>

				<form className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label
								className="mb-2 block font-medium text-white"
								htmlFor={nameId}
							>
								Name
							</label>
							<input
								className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
								id={nameId}
								placeholder="Your name"
								type="text"
							/>
						</div>
						<div>
							<label
								className="mb-2 block font-medium text-white"
								htmlFor={emailId}
							>
								Email
							</label>
							<input
								className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
								id={emailId}
								placeholder="your@email.com"
								type="email"
							/>
						</div>
					</div>

					<div>
						<label
							className="mb-2 block font-medium text-white"
							htmlFor={subjectId}
						>
							Subject
						</label>
						<select
							className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
							id={subjectId}
						>
							<option value="">Select a topic</option>
							<option value="bug">Bug Report</option>
							<option value="feature">Feature Request</option>
							<option value="billing">Billing Question</option>
							<option value="technical">Technical Support</option>
							<option value="feedback">General Feedback</option>
							<option value="other">Other</option>
						</select>
					</div>

					<div>
						<label
							className="mb-2 block font-medium text-white"
							htmlFor={messageId}
						>
							Message
						</label>
						<textarea
							className="w-full resize-none rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none"
							id={messageId}
							placeholder="Describe your issue or question in detail..."
							rows={6}
						/>
					</div>

					<div className="flex items-center gap-3">
						<input
							className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-pink-600 focus:ring-2 focus:ring-pink-500"
							id={includeLogsId}
							type="checkbox"
						/>
						<label className="text-gray-400 text-sm" htmlFor={includeLogsId}>
							Include system logs with my message (helps with troubleshooting)
						</label>
					</div>

					<button
						className="rounded-lg bg-pink-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-pink-700"
						type="submit"
					>
						Send Message
					</button>
				</form>
			</div>

			{/* Support Options */}
			<div className="mb-8 rounded-lg bg-gray-800 p-6">
				<h2 className="mb-4 font-semibold text-white text-xl">
					Other Ways to Get Help
				</h2>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="flex items-start gap-4">
						<div className="rounded-lg bg-pink-500 p-3">
							<svg
								className="h-6 w-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Documentation icon</title>
								<path
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
								/>
							</svg>
						</div>
						<div>
							<h3 className="mb-2 font-semibold text-white">Documentation</h3>
							<p className="mb-3 text-gray-400 text-sm">
								Check our comprehensive guides and FAQs
							</p>
							<Link
								className="font-medium text-pink-400 text-sm transition-colors hover:text-pink-300"
								href="/"
							>
								View Documentation →
							</Link>
						</div>
					</div>

					<div className="flex items-start gap-4">
						<div className="rounded-lg bg-pink-500 p-3">
							<svg
								className="h-6 w-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Community icon</title>
								<path
									d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
								/>
							</svg>
						</div>
						<div>
							<h3 className="mb-2 font-semibold text-white">Community Forum</h3>
							<p className="mb-3 text-gray-400 text-sm">
								Get help from other users and share tips
							</p>
							<Link
								className="font-medium text-pink-400 text-sm transition-colors hover:text-pink-300"
								href="/"
							>
								Join Community →
							</Link>
						</div>
					</div>

					<div className="flex items-start gap-4">
						<div className="rounded-lg bg-pink-500 p-3">
							<svg
								className="h-6 w-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Status icon</title>
								<path
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
								/>
							</svg>
						</div>
						<div>
							<h3 className="mb-2 font-semibold text-white">System Status</h3>
							<p className="mb-3 text-gray-400 text-sm">
								Check if there are any ongoing issues
							</p>
							<Link
								className="font-medium text-pink-400 text-sm transition-colors hover:text-pink-300"
								href="/"
							>
								View Status →
							</Link>
						</div>
					</div>

					<div className="flex items-start gap-4">
						<div className="rounded-lg bg-pink-500 p-3">
							<svg
								className="h-6 w-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Email icon</title>
								<path
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
								/>
							</svg>
						</div>
						<div>
							<h3 className="mb-2 font-semibold text-white">Direct Email</h3>
							<p className="mb-3 text-gray-400 text-sm">
								Reach out to us directly via email
							</p>
							<Link
								className="font-medium text-pink-400 text-sm transition-colors hover:text-pink-300"
								href="mailto:support@t3chat.com"
							>
								support@t3chat.com →
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Response Time */}
			<div className="rounded-lg border border-blue-700/50 bg-blue-900/20 p-6">
				<div className="flex items-start gap-3">
					<div className="text-blue-400 text-xl">ℹ️</div>
					<div>
						<h3 className="mb-2 font-semibold text-blue-400">Response Times</h3>
						<div className="space-y-1 text-blue-200 text-sm">
							<p>
								<span className="font-medium">Pro users:</span> Within 4 hours
								during business hours
							</p>
							<p>
								<span className="font-medium">Free users:</span> Within 24-48
								hours
							</p>
							<p>
								<span className="font-medium">Critical issues:</span> We aim to
								respond within 1 hour
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
