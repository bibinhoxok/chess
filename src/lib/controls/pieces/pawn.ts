import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getPieceAt } from "../board/utils"
import { isSquareOnBoard } from "../board/conditions"
import { isEnPassant, isPromotion } from "../board/special-move-conditions"

export const getPawnForwardMoves = (color: Color, from: Square, board: Board): Square[] => {
	const oneSquareForward = color === "white" ? 1 : -1
	const startRow = color === "white" ? 1 : 6
	const twoSquaresForward = color === "white" ? 2 : -2

	const directions =
		startRow === from.row
			? [
				{ col: 0, row: oneSquareForward },
				{ col: 0, row: twoSquaresForward },
			]
			: [{ col: 0, row: oneSquareForward }]
	const getMove = (direction: { col: number; row: number }) => {
		const to = { col: from.col + direction.col, row: from.row + direction.row }
		if (!isSquareOnBoard(to)) return []
		if (
			direction.row === twoSquaresForward &&
			getMove({ col: 0, row: oneSquareForward })?.length === 0
		)
			return []
		const pieceAtTarget = getPieceAt(to, board)
		if (pieceAtTarget === null) return [to]
		return []
	}
	return directions.flatMap(direction => getMove(direction))
}

export const getPawnCaptureMoves = (color: Color, from: Square, board: Board): Square[] => {
	const forward = color === "white" ? 1 : -1
	const captureDirections = [-1, 1]
	const directions = captureDirections.map(direction => ({ col: direction, row: forward }))
	return directions.flatMap(direction => {
		const to = { col: from.col + direction.col, row: from.row + direction.row }
		if (!isSquareOnBoard(to)) return []
		const pieceAtTarget = getPieceAt(to, board)
		if (pieceAtTarget === null) return []
		if (pieceAtTarget.color !== color) return [to]
		return []
	})
}

export const getPawnPromoteMoves = (color: Color, from: Square, board: Board): Square[] => {
	const captureMoves = getPawnCaptureMoves(color, from, board)
	const forwardMoves = getPawnForwardMoves(color, from, board)
	return isPromotion(getPieceAt(from, board) as Piece, from)
		? [...captureMoves, ...forwardMoves]
		: []
}

export const getEnPassantMove = (color: Color, from: Square, board: Board): Square[] => {
	const forward = color === "white" ? 1 : -1
	const captureDirections = [-1, 1]
	const directions = captureDirections.map(direction => ({ col: direction, row: forward }))
	return directions.flatMap(direction => {
		const to = { col: from.col + direction.col, row: from.row + direction.row }
		if (!isSquareOnBoard(to)) return []
		if (
			isEnPassant(board, getPieceAt(from, board) as Piece, from, {
				col: from.col + direction.col,
				row: from.row,
			} as Square)
		)
			return [to]
		return []
	})
}

export const getPossiblePawnMoves = (from: Square, piece: Piece, board: Board): Square[] => {
	const { color } = piece
	return [
		...getPawnForwardMoves(color, from, board),
		...getPawnCaptureMoves(color, from, board),
		...getEnPassantMove(color, from, board),
		...getPawnPromoteMoves(color, from, board),
	]
}

export const pawn = (color: Color): Piece => ({
	color,
	name: "pawn",
	value: 1,
})
