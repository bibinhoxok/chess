import React from 'react';

const Sidebar = () => {
	return (
		<div className="w-64 h-screen bg-gray-900 text-white p-4">
			<h2 className="text-2xl font-bold mb-4">Chess</h2>
			<ul>
				<li className="mb-2">
					<a href="#" className="hover:text-gray-400">
						New Game
					</a>
				</li>
				<li className="mb-2">
					<a href="#" className="hover:text-gray-400">
						Load Game
					</a>
				</li>
				<li className="mb-2">
					<a href="#" className="hover:text-gray-400">
						Settings
					</a>
				</li>
			</ul>
		</div>
	);
};

export default Sidebar;
