import { Board, Piece, PieceMove, Square } from "@/lib/types/main"
import { isSquareThreatened } from "./conditions"


export const isCastling = (board: Board, kingPiece: Piece, rookPiece: Piece) => {
	// 1. Check if the king or the rook have moved before.
	if (board.gameHistory.some(move => move.type === 'regular' && (move.piece === kingPiece || move.piece === rookPiece))) {
		return false
	}

	// 2. Check if there are any pieces between the king and the rook.
	const squaresBetween: number[] = []
	const startFile = Math.min(kingPiece.currentSquare.file, rookPiece.currentSquare.file)
	const endFile = Math.max(kingPiece.currentSquare.file, rookPiece.currentSquare.file)

	for (let file = startFile + 1; file < endFile; file++) {
		squaresBetween.push(file)
	}

	if (squaresBetween.some(file => board.currentPieces[kingPiece.currentSquare.rank][file])) {
		return false
	}

	// 3. The king must not be currently in check.
	if (isSquareThreatened(board, kingPiece.currentSquare, kingPiece.color)) {
		return false
	}

	// 4. The king must not pass through or end up on a square that is under attack.
	const direction = Math.sign(rookPiece.currentSquare.file - kingPiece.currentSquare.file)
	const kingPassSquare = { rank: kingPiece.currentSquare.rank, file: kingPiece.currentSquare.file + direction }
	const kingEndSquare = { rank: kingPiece.currentSquare.rank, file: kingPiece.currentSquare.file + 2 * direction }

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

	const capturedPiece = board.currentPieces[capturedSquare.rank][capturedSquare.file]

	// 1. The captured piece must be a pawn of the opposite color.
	if (!capturedPiece || capturedPiece.name !== "pawn" || capturedPiece.color === pawn.color) {
		return false
	}

	// 2. The last move must have been that pawn moving two squares forward.
	const wasTwoSquareAdvance = Math.abs(lastMove.from.rank - lastMove.to.rank) === 2
	const isCorrectPiece = lastMove.to.rank === capturedSquare.rank && lastMove.to.file === capturedSquare.file

	if (!wasTwoSquareAdvance || !isCorrectPiece) {
		return false
	}

	// 3. The attacking pawn must be on the correct rank.
	const isCorrectRankForWhite = pawn.color === "white" && pawn.currentSquare.rank === 4
	const isCorrectRankForBlack = pawn.color === "black" && pawn.currentSquare.rank === 3

	if (!isCorrectRankForWhite && !isCorrectRankForBlack) {
		return false
	}

	return true
}

export const isPromotion = (pawn: Piece) => {
	if (pawn.color === 'white' && pawn.currentSquare.rank === 7)
		return true
	if (pawn.color === 'black' && pawn.currentSquare.rank === 0)
		return true
	return false
 }
 
export const getMoveType = (board: Board, pieceMove: PieceMove): "regular" | "promotion" | "castling" | "enPassant" => {
	const { piece, from, to } = pieceMove
	
	if (piece.name === "king" && Math.abs(from.file - to.file) === 2) {
		const rookFile = to.file > from.file ? 7 : 0
		const rook = board.currentPieces[from.rank][rookFile]
		if (rook && rook.name === "rook" && isCastling(board, piece, rook)) {
			return "castling"
		}
	}

	if (piece.name === "pawn") {
		if (isPromotion(piece)) {
			return "promotion"
		}
		
		const isDiagonal = from.file !== to.file
		const isMovingToEmptySquare = !board.currentPieces[to.rank][to.file]

		if (isDiagonal && isMovingToEmptySquare) {
			const capturedPawnSquare = { rank: from.rank, file: to.file }
			if (isEnPassant(board, piece, capturedPawnSquare)) {
				return "enPassant"
			}
		}
	}

	return "regular"
}
