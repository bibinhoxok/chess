import React from "react"
import useChessboard from "@/lib/store/use-chess-board"
import {
	getSANFromMove,
	getResultSAN,
	createPGNFromBoard,
} from "@/lib/translate/PGN-parser"
import { chessBoard } from "@/lib/controls/board/chess-board"

const GameHistory = () => {
	const board = useChessboard()
	const { gameHistory, gameStatus, currentPlayer } = board
	const moves = React.useMemo(() => {
		const pairs = gameHistory.reduce((acc, history, i) => {
			const boardBefore =
				i === 0 ? chessBoard() : gameHistory[i - 1].board
			const san = getSANFromMove(boardBefore, history.move)
			if (i % 2 === 0) {
				acc.push({ white: san, black: "" })
			} else {
				acc[acc.length - 1].black = san
			}
			return acc
		}, [] as { white: string; black: string }[])
		const result = getResultSAN(gameStatus, currentPlayer)
		if (result !== "*") {
			pairs.push({ white: result, black: "" })
		}
		return pairs
	}, [gameHistory, gameStatus, currentPlayer])

	const downloadPGN = () => {
		const pgn = createPGNFromBoard(board)
		const blob = new Blob([pgn], { type: "text/plain" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = "game.pgn"
		a.click()
		URL.revokeObjectURL(url)
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto min-h-0 bg-gray-800 rounded-lg p-2 mb-4">
				<table className="w-full text-left text-sm text-gray-300">
					<thead>
						<tr className="border-b border-gray-700">
							<th className="py-2 px-2">#</th>
							<th className="py-2 px-2">White</th>
							<th className="py-2 px-2">Black</th>
						</tr>
					</thead>
					<tbody>
						{moves.map((move, index) => (
							<tr
								key={index}
								className="even:bg-gray-700/50 hover:bg-gray-700 transition-colors"
							>
								<td className="py-1 px-2 text-gray-500">
									{index + 1}.
								</td>
								<td className="py-1 px-2 font-medium text-white">
									{move.white}
								</td>
								<td className="py-1 px-2 font-medium text-white">
									{move.black}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{gameStatus !== "ongoing" && <div className="flex gap-2 mt-auto mb-0">
				<button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
					<span>🔍</span> Analyze
				</button>
				<button
					onClick={downloadPGN}
					className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors"
					title="Download PGN"
				>
					📥
				</button>
			</div>}
		</div>
	)
}

export default GameHistory
