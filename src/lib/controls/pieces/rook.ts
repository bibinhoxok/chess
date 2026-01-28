import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getStraightMovesInDirection } from "../board/moves"

export const getPossibleRookMoves = (from: Square, piece: Piece, board: Board): Square[] => {
	const { color } = piece
	const directions = [
		{ col: 1, row: 0 },
		{ col: -1, row: 0 },
		{ col: 0, row: 1 },
		{ col: 0, row: -1 },
	]

	return directions.flatMap(direction => getStraightMovesInDirection(from, direction, board, color))
}

export const rook = (color: Color): Piece => ({
	color,
	name: "rook",
	value: 5,
})
