import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getStraightMovesInDirection } from "../utils"

const getPossibleMoves = (color: Color, from: Square, board: Board): Square[] => {
	const directions = [
		{ col: 1, row: 0 },
		{ col: -1, row: 0 },
		{ col: 0, row: 1 },
		{ col: 0, row: -1 }
	]

	return directions.flatMap(direction => getStraightMovesInDirection(from, direction, board, color))
}

export const rook = (color: Color, currentSquare: Square): Piece => ({
	color,
	name: "rook",
	currentSquare,
	value: 5,
	getPossibleMoves
})