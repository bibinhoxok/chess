import { Board, Piece } from "@/lib/types/main"
import { isSquareThreatened } from "./conditions"


export const isCastling = (board: Board, kingPiece: Piece, rookPiece: Piece) => {
	// 1. Check if the king or the rook have moved before.
	if (board.gameHistory.some(move => move.piece === kingPiece || move.piece === rookPiece)) {
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

const enPassant = () => { }

const promotion = () => { }