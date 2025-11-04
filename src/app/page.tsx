"use client";
import Sidebar from '@/components/layout/sidebar';
import RightWrapper from '@/components/layout/right-wrapper';
import MainContent from '@/components/layout/main-content';

export default function Home() {

	return (
		<main className="flex bg-gray-800 min-h-screen">
			<Sidebar />
			<MainContent/>
			<RightWrapper/>
		</main>
	);
}
