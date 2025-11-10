import { Board, Piece, PieceMove, Square } from "@/lib/types/main"
import { isSquareThreatened } from "./conditions"


export const isCastling = (board: Board, kingPiece: Piece, rookPiece: Piece) => {
	// 1. Check if the king or the rook have moved before.
	if (board.gameHistory.some(move => move.type === 'regular' && (move.piece === kingPiece || move.piece === rookPiece))) {
		return false
	}

	// 2. Check if there are any pieces between the king and the rook.
	const startCol = Math.min(kingPiece.currentSquare.col, rookPiece.currentSquare.col)
	const endCol = Math.max(kingPiece.currentSquare.col, rookPiece.currentSquare.col)
	const squaresBetween: number[] = Array.from({ length: endCol - startCol - 1 }, (_, i) => i + startCol + 1)

	if (squaresBetween.some(col => board.currentPieces[kingPiece.currentSquare.row][col])) {
		return false
	}

	// 3. The king must not be currently in check.
	if (isSquareThreatened(board, kingPiece.currentSquare, kingPiece.color)) {
		return false
	}

	// 4. The king must not pass through or end up on a square that is under attack.
	const direction = Math.sign(rookPiece.currentSquare.col - kingPiece.currentSquare.col)
	const kingPassSquare = { row: kingPiece.currentSquare.row, col: kingPiece.currentSquare.col + direction }
	const kingEndSquare = { row: kingPiece.currentSquare.row, col: kingPiece.currentSquare.col + 2 * direction }

	if (isSquareThreatened(board, kingPassSquare, kingPiece.color) || isSquareThreatened(board, kingEndSquare, kingPiece.color)) {
		return false
	}

	return true
}

export const isEnPassant = (board: Board, pawn: Piece, capturedSquare: Square) => {
	if (board.gameHistory.length === 0) {
		return false
	}

	const lastMove = board.gameHistory[board.gameHistory.length - 1]
	if (lastMove.type !== 'regular') {
		return false
	}

	const capturedPiece = board.currentPieces[capturedSquare.row][capturedSquare.col]

	// 1. The captured piece must be a pawn of the opposite color.
	if (!capturedPiece || capturedPiece.name !== "pawn" || capturedPiece.color === pawn.color) {
		return false
	}

	// 2. The last move must have been that pawn moving two squares forward.
	const wasTwoSquareAdvance = Math.abs(lastMove.from.row - lastMove.to.row) === 2
	const isCorrectPiece = lastMove.to.row === capturedSquare.row && lastMove.to.col === capturedSquare.col

	if (!wasTwoSquareAdvance || !isCorrectPiece) {
		return false
	}

	// 3. The attacking pawn must be on the correct row.
	const isCorrectRowForWhite = pawn.color === "white" && pawn.currentSquare.row === 4
	const isCorrectRowForBlack = pawn.color === "black" && pawn.currentSquare.row === 3

	if (!isCorrectRowForWhite && !isCorrectRowForBlack) {
		return false
	}

	return true
}

export const isPromotion = (pawn: Piece) => {
	if (pawn.color === 'white' && pawn.currentSquare.row === 6) //This is the position before moving 
		return true
	if (pawn.color === 'black' && pawn.currentSquare.row === 1)
		return true
	return false
 }
 
export const getMoveType = (board: Board, pieceMove: PieceMove): "regular" | "promotion" | "castling" | "enPassant" => {
	const { piece, from, to } = pieceMove
	
	if (piece.name === "king" && Math.abs(from.col - to.col) === 2) {
		const rookCol = to.col > from.col ? 7 : 0
		const rook = board.currentPieces[from.row][rookCol]
		if (rook && rook.name === "rook" && isCastling(board, piece, rook)) {
			return "castling"
		}
	}

	if (piece.name === "pawn") {
		if (isPromotion(piece)) {
			return "promotion"
		}
		
		const isDiagonal = from.col !== to.col
		const isMovingToEmptySquare = !board.currentPieces[to.row][to.col]

		if (isDiagonal && isMovingToEmptySquare) {
			const capturedPawnSquare = { row: from.row, col: to.col }
			if (isEnPassant(board, piece, capturedPawnSquare)) {
				return "enPassant"
			}
		}
	}

	return "regular"
}
