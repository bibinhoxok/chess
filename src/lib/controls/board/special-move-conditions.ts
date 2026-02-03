import { Board, Piece, PieceMove, Square } from "@/lib/types/main"
import { areSameSquare, isSquareThreatened } from "./conditions"
import { getPieceAt } from "./utils"

export const isCastling = ( board: Board, kingSquare: Square, rookSquare: Square) => {
	const kingPiece = getPieceAt(kingSquare,board) as Piece

	// 1. Check if the king or the rook have moved before.
	if (board.gameHistory.some(move => move.type === "regular" && (move.from === kingSquare || move.from === rookSquare))) return false

	// 2. Check if there are any pieces between the king and the rook.
	const startCol = Math.min(kingSquare.col, rookSquare.col)
	const endCol = Math.max(kingSquare.col, rookSquare.col)
	const squaresBetween: number[] = Array.from({ length: endCol - startCol - 1 }, (_, i) => i + startCol + 1)
	if (squaresBetween.some(col => board.currentPieces[kingSquare.row][col])) return false

	// 3. The king must not be currently in check.
	if (isSquareThreatened(board, kingSquare, kingPiece.color)) return false

	// 4. The king must not pass through or end up on a square that is under attack.
	const direction = Math.sign(rookSquare.col - kingSquare.col)
	const kingPassSquare = { row: kingSquare.row, col: kingSquare.col + direction }
	const kingEndSquare = { row: kingSquare.row, col: kingSquare.col + 2 * direction }
	if (isSquareThreatened(board, kingPassSquare, kingPiece.color) || isSquareThreatened(board, kingEndSquare, kingPiece.color)) return false

	return true
}

export const isEnPassant = (
	board: Board,
	pawn: Piece,
	pawnSquare: Square,
	capturedSquare: Square,
) => {
	if (board.gameHistory.length === 0) return false

	const lastMove = board.gameHistory[board.gameHistory.length - 1]
	if (lastMove.type !== "regular") return false

	const capturedPiece = board.currentPieces[capturedSquare.row][capturedSquare.col]

	// 1. The captured piece must be a pawn of the opposite color.
	if (!capturedPiece || capturedPiece.name !== "pawn" || capturedPiece.color === pawn.color) return false

	// 2. The last move must have been that pawn moving two squares forward.
	const wasTwoSquareAdvance = Math.abs(lastMove.from.row - lastMove.to.row) === 2
	const isCorrectPiece = areSameSquare(lastMove.to, capturedSquare)
	if (!wasTwoSquareAdvance || !isCorrectPiece) return false

	// 3. The attacking pawn must be on the correct row.
	const isCorrectRowForWhite = pawn.color === "white" && pawnSquare.row === 4
	const isCorrectRowForBlack = pawn.color === "black" && pawnSquare.row === 3
	if (!isCorrectRowForWhite && !isCorrectRowForBlack) return false

	return true
}

export const isPromotion = (pawn: Piece, pawnSquare: Square) => {
	//This is the position before moving
	if (pawn.color === "white" && pawnSquare.row === 6) return true
	if (pawn.color === "black" && pawnSquare.row === 1) return true
	return false
}

export const getMoveType = (board: Board, pieceMove: PieceMove): "regular" | "promotion" | "castling" | "enPassant" => {
	const { from, to } = pieceMove
	const piece = getPieceAt(from,board) as Piece
	if (piece.name === "king" && Math.abs(from.col - to.col) === 2) {
		const rookCol = to.col > from.col ? 7 : 0
		const rookSquare = { row: from.row, col: rookCol }
		const rook = board.currentPieces[from.row][rookCol]
		if (rook && rook.name === "rook" && isCastling(board, from, rookSquare)) return "castling"
	}

	if (piece.name === "pawn") {
		if (isPromotion(piece, from)) return "promotion"
		const isDiagonal = from.col !== to.col
		const isMovingToEmptySquare = !board.currentPieces[to.row][to.col]
		if (isDiagonal && isMovingToEmptySquare) {
			const capturedPawnSquare = { row: from.row, col: to.col }
			if (isEnPassant(board, piece, from, capturedPawnSquare)) return "enPassant"
		}
	}

	return "regular"
}
