import {
	Board,
	Piece,
	Move,
	Square,
	Color,
	RegularMove,
	PromotionMove,
	PieceMove,
	CastlingMove,
	EnPassantMove,
	PieceName,
} from "@/lib/types/main"
import { areSameSquare, isSquareOnBoard, isValidMove } from "./conditions"
import { getPieceAt, getSquareFromPieceType } from "./utils"
import { chessBoard } from "./chess-board"
import { getPossiblePawnMoves } from "../pieces/pawn"
import { getPossibleRookMoves } from "../pieces/rook"
import { getPossibleKnightMoves } from "../pieces/knight"
import { getPossibleBishopMoves } from "../pieces/bishop"
import { getPossibleKingMoves } from "../pieces/king"
import { getPossibleQueenMoves } from "../pieces/queen"
import { pieces } from "../pieces"


export const getStraightMovesInDirection = (
	from: Square,
	direction: { col: number; row: number },
	board: Board,
	color: Color,
): Square[] => {
	// Generate all squares in a given direction
	const squaresInDirection = Array.from({ length: 7 }, (_, i) => ({
		col: from.col + direction.col * (i + 1),
		row: from.row + direction.row * (i + 1),
	}))

	// Take squares until we go off the board
	const firstOffBoardIndex = squaresInDirection.findIndex(
		(sq) => !isSquareOnBoard(sq),
	)
	const onBoardSquares =
		firstOffBoardIndex === -1
			? squaresInDirection
			: squaresInDirection.slice(0, firstOffBoardIndex)

	// Find the first piece in the path
	const firstPieceIndex = onBoardSquares.findIndex((square) =>
		getPieceAt(square, board),
	)

	// If no piece is found, all squares on the board in this direction are valid
	if (firstPieceIndex === -1) return onBoardSquares

	// Include the square with the piece if it's an opponent's piece
	const blockingPiece = getPieceAt(onBoardSquares[firstPieceIndex], board)
	const isOpponentsPiece = blockingPiece && blockingPiece.color !== color
	const moves = onBoardSquares.slice(
		0,
		isOpponentsPiece ? firstPieceIndex + 1 : firstPieceIndex,
	)
	return moves
}

export const getSingleMoveInDirection = (
	from: Square,
	direction: { col: number; row: number },
	board: Board,
	color: Color,
): Square[] => {
	const to = { col: from.col + direction.col, row: from.row + direction.row }
	if (!isSquareOnBoard(to)) return []
	const pieceAtTarget = getPieceAt(to, board)
	if (pieceAtTarget === null) return [to]
	if (pieceAtTarget.color !== color) return [to]
	return []
}

export const getPseudoLegalMoves = (
	targetPieceSquare: Square,
	board: Board,
) => {
	const piece = getPieceAt(targetPieceSquare, board)
	if (!piece) return []
	const moves = {
		pawn: getPossiblePawnMoves,
		rook: getPossibleRookMoves,
		knight: getPossibleKnightMoves,
		bishop: getPossibleBishopMoves,
		queen: getPossibleQueenMoves,
		king: getPossibleKingMoves,
	}
	return moves[piece.name](targetPieceSquare, piece, board)
}

export const getPossibleMoves = (targetPieceSquare: Square, board: Board) =>
	getPseudoLegalMoves(targetPieceSquare, board).filter((to) =>
		isValidMove(board, targetPieceSquare, to),
	)

export const createNewCurrentPieces = (
	board: Board,
	pieceMoves: PieceMove[],
	promotePiece?: Piece,
) =>
	pieceMoves.reduce((currentBoard, move) => {
		const newboard = { ...board, currentPieces: currentBoard }
		const movingPiece = getPieceAt(move.from, newboard)
		if (!movingPiece) return currentBoard
		return currentBoard.map((row, rowIndex) => {
			return row.map((piece, colIndex) => {
				const landingMove = areSameSquare(move.to, {
					row: rowIndex,
					col: colIndex,
				})
				if (landingMove) {
					if (promotePiece) return promotePiece
					return movingPiece
				}
				if (areSameSquare(move.from, { row: rowIndex, col: colIndex }))
					return null
				return piece
			})
		})
	}, board.currentPieces)
export const createCastlingMove = (
	kingMove: PieceMove,
	rookMove: PieceMove,
): CastlingMove => {
	return {
		type: "castling",
		kingMove,
		rookMove,
	}
}

export const createPromotionMove = (
	from: Square,
	to: Square,
	promotionPiece: Piece,
	capturedPiece?: Piece,
): PromotionMove => {
	return {
		type: "promotion",
		from,
		to,
		promotionTo: promotionPiece,
		capturedPiece,
	}
}

export const createEnPassantMove = (
	from: Square,
	to: Square,
	capturedSquare: Square,
): EnPassantMove => {
	return {
		type: "enPassant",
		from,
		to,
		capturedSquare,
	}
}

export const createRegularMove = (
	from: Square,
	to: Square,
	capturedPiece?: Piece,
): RegularMove => {
	return {
		type: "regular",
		from,
		to,
		capturedPiece,
	}
}

const getBoardAfterRegularMove = (board: Board, move: RegularMove): Board => ({
	...board,
	currentPieces: createNewCurrentPieces(board, [move]),
	capturedPieces: move?.capturedPiece
		? [...board.capturedPieces, move?.capturedPiece]
		: board.capturedPieces,
})

const getBoardAfterPromotionMove = (board: Board, move: PromotionMove): Board => ({
	...board,
	currentPieces: createNewCurrentPieces(board, [move], move.promotionTo),
	capturedPieces: move?.capturedPiece
		? [...board.capturedPieces, move?.capturedPiece]
		: board.capturedPieces,
})
const getBoardAfterCastlingMove = (board: Board, move: CastlingMove): Board => ({
	...board,
	currentPieces: createNewCurrentPieces(board, [
		move.kingMove,
		move.rookMove,
	]),
})

const getBoardAfterEnPassantMove = (board: Board, move: EnPassantMove): Board => ({
	...board,
	// Move the pawn to the captured square to remove the enemy piece, then move to the final destination
	currentPieces: createNewCurrentPieces(board, [
		{ from: move.from, to: move.capturedSquare } as PieceMove,
		{ from: move.capturedSquare, to: move.to } as PieceMove,
	]),
	capturedPieces: [
		...board.capturedPieces,
		getPieceAt(move.capturedSquare, board)!,
	],
})

export const movePiece = (board: Board, move: Move): Board => {
	const moves = {
		regular: () => getBoardAfterRegularMove(board, move as RegularMove),
		promotion: () => getBoardAfterPromotionMove(board, move as PromotionMove),
		castling: () => getBoardAfterCastlingMove(board, move as CastlingMove),
		enPassant: () => getBoardAfterEnPassantMove(board, move as EnPassantMove),
	}
	const nextBoardState = moves[move.type]()
	const newHistory = board.gameHistory.slice(0, board.currentHistoryIndex + 1)
	newHistory.push({ move, board: nextBoardState })

	return {
		...nextBoardState,
		currentPlayer: board.currentPlayer === "white" ? "black" : "white",
		gameHistory: newHistory,
		currentHistoryIndex: newHistory.length - 1,
	}
}

export const getCandidateSquares = (
	board: Board,
	pieceName: PieceName,
	target: Square,
): Square[] => {
	const validPieces = getSquareFromPieceType(
		board,
		[pieceName],
		board.currentPlayer,
	)

	return validPieces.filter((square) => {
		const possible = getPossibleMoves(square, board)
		return possible.some(
			(m) => m.col === target.col && m.row === target.row,
		)
	})
}

export const findMovingPiece = (
	board: Board,
	pieceName: PieceName,
	target: Square,
	fromFile?: string,
	fromRank?: string,
): Square | null => {
	const candidates = getCandidateSquares(board, pieceName, target)

	return (
		candidates.find((square) => {
			if (
				fromFile &&
				(fromFile.charCodeAt(0) - "a".charCodeAt(0)) !== square.col
			)
				return false
			if (fromRank && parseInt(fromRank) - 1 !== square.row) return false
			return true
		}) ?? null
	)
}

export const undoMove = (board: Board): Board => {
	const newIndex = board.currentHistoryIndex - 1
	if (newIndex < -1) return board

	if (newIndex === -1) {
		return {
			...chessBoard(),
			gameHistory: board.gameHistory,
			currentHistoryIndex: -1,
		}
	}

	const previousEntry = board.gameHistory[newIndex]
	return {
		...previousEntry.board,
		gameHistory: board.gameHistory,
		currentHistoryIndex: newIndex,
	}
}

export const redoMove = (board: Board): Board => {
	const newIndex = board.currentHistoryIndex + 1
	if (newIndex >= board.gameHistory.length) return board

	const nextEntry = board.gameHistory[newIndex]
	return {
		...nextEntry.board,
		gameHistory: board.gameHistory,
		currentHistoryIndex: newIndex,
	}
}
