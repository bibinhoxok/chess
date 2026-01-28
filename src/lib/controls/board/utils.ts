import { Board, Color, Piece, PieceName, Square } from "@/lib/types/main"
import { isSquareOnBoard } from "./conditions"
import { createNewCurrentPieces, getPossibleMoves } from "./moves"

export const getPieceAt = (square: Square, board: Board): Piece | null => {
	if (!isSquareOnBoard(square)) return null
	return board.currentPieces[square.row][square.col]
}

export const getSquareFromPieceType = (board: Board, pieceNames?: PieceName[], color?: Color) => {
	const pieceNameFilter = (name: PieceName) => {
		if (!pieceNames) return true
		return pieceNames.some(v => v === name)
	}
	const colorFilter = (pieceColor: Color) => {
		if (!color) return true
		return pieceColor === color
	}
	return board.currentPieces
		.map((row, rowIndex) => {
			return row.map((piece, colIndex) => {
				if (piece && pieceNameFilter(piece.name) && colorFilter(piece.color)) {
					return { row: rowIndex, col: colIndex } as Square
				}
				return undefined
			})
		})
		.flat()
		.filter((square) => square !== undefined)
}

export const simulateMove = (board: Board, from: Square, to: Square): Board => {
	const pieceToMove = board.currentPieces[from.row][from.col]
	if (!pieceToMove) return board

	const newPieces = createNewCurrentPieces(board, [
		{ from, to, piece: pieceToMove },
	])

	return { ...board, currentPieces: newPieces }
}

export const getThreatingPieces = (board: Board, tagetPieceSquare: Square) => {
	const tagetPiece = getPieceAt(tagetPieceSquare, board)
	if (!tagetPiece) return []
	return board.currentPieces
		.map((row, rowIndex) => {
			return row.map((piece, colIndex) => {
				const isOpponentPiece = piece && piece.color !== tagetPiece.color
				if (isOpponentPiece) {
					const opponentPiecePossibleMoves = getPossibleMoves({ row: rowIndex, col: colIndex }, board)
					if (opponentPiecePossibleMoves.some(v => tagetPieceSquare.row === v.row && tagetPieceSquare.col === v.col)) {
						return { row: rowIndex, col: colIndex } as Square
					}
				}
			})
		})
		.flat()
		.filter((square) => square !== undefined)
}