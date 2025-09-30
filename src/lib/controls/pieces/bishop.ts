import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getStraightMovesInDirection } from "../utils"

const getPossibleMoves = (color: Color, from: Square,  board: Board): Square[] => {
	const directions = [
		{ file: 1, rank: 1 },   // up-right
		{ file: 1, rank: -1 },  // down-right
		{ file: -1, rank: 1 },  // up-left
		{ file: -1, rank: -1 }  // down-left
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