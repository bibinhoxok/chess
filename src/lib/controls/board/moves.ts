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
} from "@/lib/types/main"
import { areSameSquare, isSquareOnBoard } from "./conditions"
import { getPieceAt } from "./utils";
import { getPossiblePawnMoves } from "../pieces/pawn";
import { getPossibleRookMoves } from "../pieces/rook";
import { getPossibleKnightMoves } from "../pieces/knight";
import { getPossibleBishopMoves } from "../pieces/bishop";
import { getPossibleKingMoves } from "../pieces/king";
import { getPossibleQueenMoves } from "../pieces/queen";


export const getStraightMovesInDirection = (
	from: Square,
	direction: { col: number; row: number },
	board: Board,
	color: Color,
): Square[] => {
	// Generate all squares in a given direction
	const squaresInDirection = Array.from({ length: 7 }, (_, i) => ({ col: from.col + direction.col * (i + 1), row: from.row + direction.row * (i + 1), }))

	// Take squares until we go off the board
	const firstOffBoardIndex = squaresInDirection.findIndex(sq => !isSquareOnBoard(sq))
	const onBoardSquares = firstOffBoardIndex === -1 ? squaresInDirection : squaresInDirection.slice(0, firstOffBoardIndex)

	// Find the first piece in the path
	const firstPieceIndex = onBoardSquares.findIndex(square => getPieceAt(square, board))

	// If no piece is found, all squares on the board in this direction are valid
	if (firstPieceIndex === -1) return onBoardSquares

	// Include the square with the piece if it's an opponent's piece
	const blockingPiece = getPieceAt(onBoardSquares[firstPieceIndex], board)
	const isOpponentsPiece = blockingPiece && blockingPiece.color !== color
	const moves = onBoardSquares.slice(0, isOpponentsPiece ? firstPieceIndex + 1 : firstPieceIndex)
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


export const getPossibleMoves = (targetPieceSquare: Square, board: Board) => {
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

export const createNewCurrentPieces = (board: Board, pieceMoves: PieceMove[], promotePiece?: Piece) =>
	pieceMoves.reduce((currentBoard, move) => {
		return currentBoard.map((row, rowIndex) => {
			return row.map((piece, colIndex) => {
				const landingMove = areSameSquare(move.to, { row: rowIndex, col: colIndex })
				if (landingMove) {
					if (promotePiece) return promotePiece
					return move.piece
				}
				if (areSameSquare(move.from, { row: rowIndex, col: colIndex })) return null
				return piece
			})
		})
	}, board.currentPieces)
const regularMove = (board: Board, move: RegularMove): Board => ({
	...board,
	currentPieces: createNewCurrentPieces(board, [move]),
	currentPlayer: board.currentPlayer === "white" ? "black" : "white",
	gameHistory: [...board.gameHistory, move],
})

const promotionMove = (board: Board, move: PromotionMove): Board => ({
	...board,
	currentPieces: createNewCurrentPieces(board, [move], move.promotionTo),
	currentPlayer: board.currentPlayer === "white" ? "black" : "white",
	gameHistory: [...board.gameHistory, move],
})
const castlingMove = (board: Board, move: CastlingMove): Board => ({
	...board,
	currentPieces: createNewCurrentPieces(board, [move.kingMove, move.rookMove]),
	currentPlayer: board.currentPlayer === "white" ? "black" : "white",
	gameHistory: [...board.gameHistory, move],
})

const enPassantMove = (board: Board, move: EnPassantMove): Board => ({
	...board,
	// Move the pawn to the captured square to remove the enemy piece, then move to the final destination
	currentPieces: createNewCurrentPieces(board, [
		{ from: move.from, to: move.capturedSquare, piece: move.piece } as PieceMove,
		{ from: move.capturedSquare, to: move.to, piece: move.piece } as PieceMove,
	]),
	currentPlayer: board.currentPlayer === "white" ? "black" : "white",
	gameHistory: [...board.gameHistory, move],
})

export const movePiece = (board: Board, move: Move): Board => {
	const moves = {
		regular: () => regularMove(board, move as RegularMove),
		promotion: () => promotionMove(board, move as PromotionMove),
		castling: () => castlingMove(board, move as CastlingMove),
		enPassant: () => enPassantMove(board, move as EnPassantMove),
	}
	return moves[move.type]()
}

// Under construction
export const undoMove = (board: Board): Board => {
	return board
}
