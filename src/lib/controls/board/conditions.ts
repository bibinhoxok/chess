import { Square, Color, Board, Piece, GameStatus } from "@/lib/types/main"
import { getPawnCaptureMoves } from "@/lib/controls/pieces/pawn"


export const isSquareOnBoard = (square: Square) => {
	return square.col >= 0 && square.col < 8 &&
		square.row >= 0 && square.row < 8
}

const isPseudoLegalMove = (getPossibleMoves: Piece['getPossibleMoves'], color: Color, from: Square, board: Board, to: Square) => {
	const possibleMoves = getPossibleMoves(color, from, board)
	return possibleMoves.some(move => move.col === to.col && move.row === to.row)
}

const isPawnVaildCapture = (board: Board, piece: Piece, square: Square) => (getPawnCaptureMoves(piece.color, piece.currentSquare, board).some(move => move.col === square.col && move.row === square.row))


export const isSquareThreatened = (board: Board, square: Square, defendingColor: Color) => {
	const attackingColor: Color = defendingColor === "white" ? "black" : "white"
	return board.currentPieces.flat().some(piece => {
		if (piece && piece.color === attackingColor) {
			if (piece.name === 'pawn' && isPawnVaildCapture(board, piece, square)) return true
			else return isPseudoLegalMove(piece.getPossibleMoves, piece.color, piece.currentSquare, board, square)
		}
		return false
	})
}

export const isValidMove = (getPossibleMoves: Piece['getPossibleMoves'], color: Color, from: Square, board: Board, to: Square) => {
	const piece = board.currentPieces[from.row][from.col];
	if (!piece) return false
	if (isChecked(board)) return false

	// Check if the move is pseudo-legal
	if (!isPseudoLegalMove(getPossibleMoves, color, from, board, to)) {
		return false;
	}

	// Simulate the move
	const capturedPiece = board.currentPieces[to.row][to.col];
	board.currentPieces[to.row][to.col] = piece;
	board.currentPieces[from.row][from.col] = null;

	// Check if the king is in check after the move
	const king = board.currentPieces.flat().find(p => p && p.name === 'king' && p.color === color);
	let isKingInCheck = false;
	if (king) {
		isKingInCheck = isSquareThreatened(board, king.currentSquare, color);
	}

	// Revert the move
	board.currentPieces[from.row][from.col] = piece;
	board.currentPieces[to.row][to.col] = capturedPiece;

	return !isKingInCheck;
};

const hasValidMoves = (board: Board) => {
	const currentPlayerPieces = board.currentPieces.flat().filter(piece => piece && piece.color === board.currentPlayer)
	return currentPlayerPieces.some(piece => {
		if (!piece) return false
		const possibleMoves = piece.getPossibleMoves(piece.color, piece.currentSquare, board)
		return possibleMoves.some(move => isValidMove(piece.getPossibleMoves, piece.color, piece.currentSquare, board, move))
	})
}


export const isChecked = (board: Board) => {
	const king = board.currentPieces.flat().find(piece => piece && piece.name === 'king' && piece.color === board.currentPlayer)
	if (!king) return false
	return isSquareThreatened(board, king.currentSquare, board.currentPlayer)
}

export const isCheckedMate = (board: Board) => {
	if (!isChecked(board)) return false
	return !hasValidMoves(board)
}

export const isStaleMate = (board: Board) => {
	if (isChecked(board)) return false
	return !hasValidMoves(board)
}

export const isInsufficientMaterial = (board: Board) => {
	const pieces = board.currentPieces.flat().flatMap(p => p ? [p] : [])
	const nonKingPieces = pieces.filter(p => p.name !== 'king')
	const whiteNonKingPieces = nonKingPieces.filter(p => p.color === 'white')
	const blackNonKingPieces = nonKingPieces.filter(p => p.color === 'black')

	// Case 1: King vs King
	if (nonKingPieces.length === 0) {
		return true
	}

	// Case 2: King + single minor piece vs King
	if (nonKingPieces.length === 1) {
		const lonePiece = nonKingPieces[0]
		if (lonePiece.name === 'bishop' || lonePiece.name === 'knight') {
			return true
		}
	}

	// Case 3: King + two knights vs King
	if (nonKingPieces.length === 2
		&& (whiteNonKingPieces.length === 2 || blackNonKingPieces.length === 2)
		&& nonKingPieces.every(p => p.name === 'knight')) {
		return true
	}

	// Case 4: Both sides only have bishops, and all are on same-colored squares.
	const bishops = nonKingPieces.filter(p => p.name === 'bishop')
	if (bishops.length === nonKingPieces.length) {
		const firstBishopSquareColor = (bishops[0].currentSquare.row + bishops[0].currentSquare.col) % 2
		return bishops.every(b => {
			const color = (b.currentSquare.row + b.currentSquare.col) % 2
			return color === firstBishopSquareColor
		})
	}

	return false
}

export const checkGameStatus = (board: Board): GameStatus => {
	if (isCheckedMate(board)) return 'checkmate'
	if (isStaleMate(board)) return 'stalemate'
	if (isInsufficientMaterial(board)) return 'insufficient material'
	return 'ongoing'
}