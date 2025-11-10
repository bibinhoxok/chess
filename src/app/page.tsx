"use client";
import Sidebar from '@/app/(main)/(children)/sidebar';
import RightWrapper from '@/app/(main)/(children)/right-wrapper';
import MainContent from '@/app/(main)/(children)/main-content';

export default function Home() {

	return (
		<main className="flex bg-gray-800 min-h-screen">
			<Sidebar />
			<MainContent/>
			<RightWrapper/>
		</main>
	);
}
