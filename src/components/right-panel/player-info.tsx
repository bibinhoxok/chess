import React from "react"

const PlayerInfo = () => {
	return (
		<div className="space-y-4">
			<div className="p-4 bg-gray-800 rounded-lg">
				<h3 className="font-bold text-lg mb-2 text-white">Opponent</h3>
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center font-bold">
						OP
					</div>
					<div className="text-gray-300">Rating: 1200</div>
				</div>
				<div className="mt-2 text-sm text-gray-400">Captured: ♟️♟️</div>
			</div>

			<div className="p-4 bg-gray-800 rounded-lg">
				<h3 className="font-bold text-lg mb-2 text-white">You</h3>
				<div className="flex items-center gap-2">
					<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold">
						ME
					</div>
					<div className="text-gray-300">Rating: 1200</div>
				</div>
				<div className="mt-2 text-sm text-gray-400">Captured: ♙</div>
			</div>
		</div>
	)
}

export default PlayerInfo
