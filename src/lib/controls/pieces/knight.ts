import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getSingleMoveInDirection } from "../board/moves"

export const getPossibleKnightMoves = (
	from: Square,
	piece: Piece,
	board: Board,
): Square[] => {
	const { color } = piece
	const directions = [
		{ col: 1, row: 2 },
		{ col: 1, row: -2 },
		{ col: -1, row: 2 },
		{ col: -1, row: -2 },
		{ col: 2, row: 1 },
		{ col: 2, row: -1 },
		{ col: -2, row: 1 },
		{ col: -2, row: -1 },
	]
	return directions.flatMap((direction) =>
		getSingleMoveInDirection(from, direction, board, color),
	)
}

export const knight = (color: Color): Piece => ({
	color,
	name: "knight",
	value: 3,
})
