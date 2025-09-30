import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getStraightMovesInDirection } from "../utils"

const getPossibleMoves = (color: Color, from: Square, board: Board): Square[] => {
	const directions = [
		{ file: 1, rank: 0 },
		{ file: -1, rank: 0 },
		{ file: 0, rank: 1 },
		{ file: 0, rank: -1 },
		{ file: 1, rank: 1 },
		{ file: 1, rank: -1 },
		{ file: -1, rank: 1 },
		{ file: -1, rank: -1 }
	]

	return directions.flatMap(direction => getStraightMovesInDirection(from, direction, board, color))
}

export const queen = (color: Color, currentSquare: Square): Piece => ({
	color,
	name: "queen",
	currentSquare,
	value: 9,
	getPossibleMoves
})