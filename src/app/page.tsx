import MainContent from "./(children)/main-content";
import RightWrapper from "./(children)/right-wrapper";
import Sidebar from "./(children)/sidebar";

export default function Home() {

	return (
		<main className="flex bg-gray-800 min-h-screen">
			<Sidebar />
			<MainContent/>
			<RightWrapper/>
		</main>
	);
}
