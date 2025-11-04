import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getStraightMovesInDirection } from "../utils"

const getPossibleMoves = (color: Color, from: Square,  board: Board): Square[] => {
	const directions = [
		{ col: 1, row: 1 },   // up-right
		{ col: 1, row: -1 },  // down-right
		{ col: -1, row: 1 },  // up-left
		{ col: -1, row: -1 }  // down-left
	]

	return directions.flatMap(direction => getStraightMovesInDirection(from, direction, board, color))
}

export const bishop = (color: Color, currentSquare: Square): Piece => ({
	color,
	name: "bishop",
	currentSquare,
	value: 3,
	getPossibleMoves
})