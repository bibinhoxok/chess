import { Square, Color, Board, Piece, GameStatus } from "@/lib/types/main"
import { getPawnCaptureMoves } from "@/lib/controls/pieces/pawn"
import { getPossibleMoves } from "../pieces/possible-moves"


export const isSquareOnBoard = (square: Square) => {
	return square.col >= 0 && square.col < 8 &&
		square.row >= 0 && square.row < 8
}

const isPseudoLegalMove = (from: Square, piece: Piece, board: Board, to: Square) => {
	const possibleMoves = getPossibleMoves(from, piece, board)
	return possibleMoves.some(move => move.col === to.col && move.row === to.row)
}

export const isSquareThreatened = (board: Board, square: Square, defendingColor: Color) => {
	const attackingColor: Color = defendingColor === "white" ? "black" : "white"
	for (let r = 0; r < 8; r++) {
		for (let c = 0; c < 8; c++) {
			const piece = board.currentPieces[r][c];
			if (piece && piece.color === attackingColor) {
				const from = { row: r, col: c };
				if (piece.name === 'pawn') {
					if (getPawnCaptureMoves(piece.color, from, board).some(move => move.col === square.col && move.row === square.row)) {
						return true;
					}
				} else {
					if (isPseudoLegalMove(from, piece, board, square)) {
						return true;
					}
				}
			}
		}
	}
	return false
}

export const isValidMove = (from: Square, piece: Piece, board: Board, to: Square) => {
	if (!piece) return false

	// Check if the move is pseudo-legal
	if (!isPseudoLegalMove(from, piece, board, to)) {
		return false;
	}

	// Simulate the move
	const capturedPiece = board.currentPieces[to.row][to.col];
	board.currentPieces[to.row][to.col] = piece;
	board.currentPieces[from.row][from.col] = null;

	// Check if the king is in check after the move
	let kingSquare: Square | null = null;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board.currentPieces[r][c];
            if (p && p.name === 'king' && p.color === piece.color) {
                kingSquare = { row: r, col: c };
                break;
            }
        }
        if (kingSquare) break;
    }

	let isKingInCheck = false;
	if (kingSquare) {
		isKingInCheck = isSquareThreatened(board, kingSquare, piece.color);
	}

	// Revert the move
	board.currentPieces[from.row][from.col] = piece;
	board.currentPieces[to.row][to.col] = capturedPiece;

	return !isKingInCheck;
};

const hasValidMoves = (board: Board) => {
	for (let r = 0; r < 8; r++) {
		for (let c = 0; c < 8; c++) {
			const piece = board.currentPieces[r][c];
			if (piece && piece.color === board.currentPlayer) {
				const from = { row: r, col: c };
				const possibleMoves = getPossibleMoves(from, piece, board);
				if (possibleMoves.some(move => isValidMove(from, piece, board, move))) {
					return true;
				}
			}
		}
	}
	return false;
}


export const isChecked = (board: Board) => {
	let kingSquare: Square | null = null;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const p = board.currentPieces[r][c];
            if (p && p.name === 'king' && p.color === board.currentPlayer) {
                kingSquare = { row: r, col: c };
                break;
            }
        }
        if (kingSquare) break;
    }
	if (!kingSquare) return false
	return isSquareThreatened(board, kingSquare, board.currentPlayer)
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
	const piecesWithSquares: { piece: Piece, square: Square }[] = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board.currentPieces[r][c];
            if (piece) {
                piecesWithSquares.push({ piece, square: { row: r, col: c } });
            }
        }
    }

	const nonKingPieces = piecesWithSquares.filter(p => p.piece.name !== 'king')
	const whiteNonKingPieces = nonKingPieces.filter(p => p.piece.color === 'white')
	const blackNonKingPieces = nonKingPieces.filter(p => p.piece.color === 'black')

	// Case 1: King vs King
	if (nonKingPieces.length === 0) {
		return true
	}

	// Case 2: King + single minor piece vs King
	if (nonKingPieces.length === 1) {
		const lonePiece = nonKingPieces[0].piece
		if (lonePiece.name === 'bishop' || lonePiece.name === 'knight') {
			return true
		}
	}

	// Case 3: King + two knights vs King
	if (nonKingPieces.length === 2
		&& (whiteNonKingPieces.length === 2 || blackNonKingPieces.length === 2)
		&& nonKingPieces.every(p => p.piece.name === 'knight')) {
		return true
	}

	// Case 4: Both sides only have bishops, and all are on same-colored squares.
	const bishops = nonKingPieces.filter(p => p.piece.name === 'bishop')
	if (bishops.length > 0 && bishops.length === nonKingPieces.length) {
		const firstBishopSquareColor = (bishops[0].square.row + bishops[0].square.col) % 2
		return bishops.every(b => {
			const color = (b.square.row + b.square.col) % 2
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