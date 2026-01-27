import { Square, Color, Board, Piece, GameStatus } from "@/lib/types/main"
import { getPawnCaptureMoves } from "@/lib/controls/pieces/pawn"
import { getPossibleMoves } from "./moves"
import { getCheckedKing, getPieceAt, getSquareFromPieceType, getThreatingPieces, simulateMove } from "./utils"

export const isSquareOnBoard = (square: Square) => {
	return (
		square.col >= 0 && square.col < 8 && square.row >= 0 && square.row < 8
	)
}

const isPseudoLegalMove = (
	board: Board,
	from: Square,
	to: Square,
) => {
	const possibleMoves = getPossibleMoves(from, board)
	return possibleMoves.some(
		(move) => move.col === to.col && move.row === to.row,
	)
}

export const isSquareThreatened = (
	board: Board,
	square: Square,
	defendingColor: Color,
) => {
	const attackingColor: Color = defendingColor === "white" ? "black" : "white"
	return board.currentPieces.some((row, rowIndex) => {
		return row.some((piece, colIndex) => {
			if (piece && piece.color === attackingColor) {
				const from = { row: rowIndex, col: colIndex }
				if (piece.name === "pawn") {
					if (
						getPawnCaptureMoves(piece.color, from, board).some(
							(move) =>
								move.col === square.col &&
								move.row === square.row,
						)
					) {
						return true
					}
				} else {
					if (isPseudoLegalMove(board, from, square)) {
						return true
					}
				}
			}
			return false
		})
	})
}

export const isValidMove = (
	board: Board,
	from: Square,
	to: Square,
) => {
	const piece = getPieceAt(from, board)
	if (!piece || !isPseudoLegalMove(board, from, to)) {
		return false
	}

	const boardAfterMove = simulateMove(board, from, to)
	const kingSquare =
		piece.name === "king"
			? to
			:  getSquareFromPieceType(boardAfterMove,["king"],piece.color).at(0)

	if (!kingSquare) return true

	return !isSquareThreatened(boardAfterMove, kingSquare, piece.color)
}

const hasValidMoves = (board: Board) => {
	return board.currentPieces.some((row, rowIndex) =>
		row.some((piece, colIndex) => {
			if (piece && piece.color === board.currentPlayer) {
				const from = { row: rowIndex, col: colIndex }
				const possibleMoves = getPossibleMoves(from, board)
				return possibleMoves.some((move) =>
					isValidMove(board, from, move),
				)
			}
			return false
		}),
	)
}
export const isCheckedKing = (square: Square, board: Board) => {
	const checkedKingSquare = getCheckedKing(board)
	return checkedKingSquare?.col === square.col && checkedKingSquare.row === square.row
}

export const isThreatingKing = (square: Square, board: Board) => {
	const kingSquare = getSquareFromPieceType(board,["king"], board.currentPlayer).at(0)
	const threatingPieceSquares = getThreatingPieces(board, kingSquare!) //king is always on the board
	return threatingPieceSquares.some(v => v.col === square.col && v.row === square.row)
}

export const isPossibleMove = (square: Square, board: Board) =>
	board.selectedPiece &&
	board.selectedSquare &&
	board.selectedPiece.color === board.currentPlayer &&
	isValidMove(board, board.selectedSquare, square)

export const isChecked = (board: Board) => {
	const kingSquare = getSquareFromPieceType(board,["king"], board.currentPlayer).at(0)
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
	const piecesWithSquares = board.currentPieces
		.flatMap((row, rowIndex) =>
			row.map((piece, colIndex) =>
				piece
					? { piece, square: { row: rowIndex, col: colIndex } }
					: null,
			),
		)
		.filter(
			(item): item is { piece: Piece; square: Square } => item !== null,
		)

	const nonKingPieces = piecesWithSquares.filter(
		(p) => p.piece.name !== "king",
	)
	const whiteNonKingPieces = nonKingPieces.filter(
		(p) => p.piece.color === "white",
	)
	const blackNonKingPieces = nonKingPieces.filter(
		(p) => p.piece.color === "black",
	)

	// Case 1: King vs King
	if (nonKingPieces.length === 0) {
		return true
	}

	// Case 2: King + single minor piece vs King
	if (nonKingPieces.length === 1) {
		const lonePiece = nonKingPieces[0].piece
		if (lonePiece.name === "bishop" || lonePiece.name === "knight") {
			return true
		}
	}

	// Case 3: King + two knights vs King
	if (
		nonKingPieces.length === 2 &&
		(whiteNonKingPieces.length === 2 || blackNonKingPieces.length === 2) &&
		nonKingPieces.every((p) => p.piece.name === "knight")
	) {
		return true
	}

	// Case 4: Both sides only have bishops, and all are on same-colored squares.
	const bishops = nonKingPieces.filter((p) => p.piece.name === "bishop")
	if (bishops.length === nonKingPieces.length && nonKingPieces.length > 0) {
		const firstBishopSquareColor =
			(bishops[0].square.row + bishops[0].square.col) % 2
		return bishops.every((b) => {
			const color = (b.square.row + b.square.col) % 2
			return color === firstBishopSquareColor
		})
	}

	return false
}

export const checkGameStatus = (board: Board): GameStatus => {
	if (isCheckedMate(board)) return "checkmate"
	if (isStaleMate(board)) return "stalemate"
	if (isInsufficientMaterial(board)) return "insufficient material"
	return "ongoing"
}
