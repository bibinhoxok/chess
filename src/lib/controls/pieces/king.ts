import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getSingleMoveInDirection } from "../utils"
import { isCastling } from "../board/special-move-conditions"

export const getPossibleKingMoves = (
	from: Square,
	piece: Piece,
	board: Board,
): Square[] => {
	const { color } = piece
	const directions = [
		{ col: 1, row: 0 }, // Right
		{ col: -1, row: 0 }, // Left
		{ col: 0, row: 1 }, // Up
		{ col: 0, row: -1 }, // Down
		{ col: 1, row: 1 }, // Up-Right
		{ col: 1, row: -1 }, // Down-Right
		{ col: -1, row: 1 }, // Up-Left
		{ col: -1, row: -1 }, // Down-Left
	]
	const kingPiece = board.currentPieces[from.row][from.col]
	if (!kingPiece) return []

	const castlingMoves = board.currentPieces
		.flatMap((pieceRow, rowIndex) =>
			pieceRow.map((piece, colIndex) => ({
				piece,
				square: { row: rowIndex, col: colIndex },
			})),
		)
		.filter(({ piece }) => piece?.name === "rook" && piece.color === color)
		.filter(({ piece, square }) =>
			isCastling(board, kingPiece, from, piece!, square),
		)
		.map(({ square }) => {
			const castlingDirection = Math.sign(square.col - from.col)
			return { row: from.row, col: from.col + 2 * castlingDirection }
		})

	const moves = directions
		.flatMap((direction) =>
			getSingleMoveInDirection(from, direction, board, color),
		)
		.concat(castlingMoves)

	return moves
}

export const king = (color: Color): Piece => ({
	color,
	name: "king",
	value: 1000, // King is invaluable
})
