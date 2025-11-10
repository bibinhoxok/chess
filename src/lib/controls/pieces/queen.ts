import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getStraightMovesInDirection } from "../utils"

export const getPossibleQueenMoves = (piece: Piece, board: Board): Square[] => {
	const { color, currentSquare: from } = piece;
	const directions = [
		{ col: 1, row: 0 },
		{ col: -1, row: 0 },
		{ col: 0, row: 1 },
		{ col: 0, row: -1 },
		{ col: 1, row: 1 },
		{ col: 1, row: -1 },
		{ col: -1, row: 1 },
		{ col: -1, row: -1 }
	]

	return directions.flatMap(direction => getStraightMovesInDirection(from, direction, board, color))
}

export const queen = (color: Color, currentSquare: Square): Piece => ({
	color,
	name: "queen",
	currentSquare,
	value: 9,
})