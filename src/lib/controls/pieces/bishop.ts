import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getStraightMovesInDirection } from "../utils"

export const getPossibleBishopMoves = (
	from: Square,
	piece: Piece,
	board: Board,
): Square[] => {
	const { color } = piece
	const directions = [
		{ col: 1, row: 1 }, // up-right
		{ col: 1, row: -1 }, // down-right
		{ col: -1, row: 1 }, // up-left
		{ col: -1, row: -1 }, // down-left
	]

	return directions.flatMap((direction) =>
		getStraightMovesInDirection(from, direction, board, color),
	)
}

export const bishop = (color: Color): Piece => ({
	color,
	name: "bishop",
	value: 3,
})
