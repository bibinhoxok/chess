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
import { isSquareOnBoard } from "./conditions"
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
	if (firstPieceIndex === -1) {
		return onBoardSquares
	}

	// Include the square with the piece if it's an opponent's piece
	const blockingPiece = getPieceAt(onBoardSquares[firstPieceIndex], board)
	const isOpponentsPiece = blockingPiece && blockingPiece.color !== color

	// If a piece is found, take all squares until that piece
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
	const to = {
		col: from.col + direction.col,
		row: from.row + direction.row,
	}

	if (!isSquareOnBoard(to)) return []

	const pieceAtTarget = getPieceAt(to, board)

	if (pieceAtTarget === null) return [to]

	if (pieceAtTarget.color !== color) return [to]

	return []
}


export const getPossibleMoves = (
	tagetPieceSquare: Square,
	board: Board,
): Square[] => {
	const piece = getPieceAt(tagetPieceSquare,board)
	if (!piece) return []
	const moves = {
		pawn: getPossiblePawnMoves,
		rook: getPossibleRookMoves,
		knight: getPossibleKnightMoves,
		bishop: getPossibleBishopMoves,
		queen: getPossibleQueenMoves,
		king: getPossibleKingMoves,
	}
	return moves[piece.name](tagetPieceSquare, piece, board)
}

export const createNewCurrentPieces = (
	board: Board,
	pieceMoves: PieceMove[],
	promotePiece?: Piece,
) => {
	return board.currentPieces.map((row, rowIndex) => {
		return row.map((piece, colIndex) => {
			const landingMove = pieceMoves.findLast(
				(move) => move.to.row === rowIndex && move.to.col === colIndex,
			)
			if (landingMove) {
				if (promotePiece) {
					return promotePiece
				}
				return landingMove.piece
			}
			if (
				pieceMoves.some(
					(move) =>
						move.from.row === rowIndex &&
						move.from.col === colIndex,
				)
			) {
				return null
			}
			return piece
		})
	})
}

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
	currentPieces: createNewCurrentPieces(board, [
		move.kingMove,
		move.rookMove,
	]),
	currentPlayer: board.currentPlayer === "white" ? "black" : "white",
	gameHistory: [...board.gameHistory, move],
})

const enPassantMove = (board: Board, move: EnPassantMove): Board => ({
	...board,
	//Move the captured piece to the destination first, then the pawn move and capture it
	currentPieces: createNewCurrentPieces(board, [
		{ from: move.from, to: move.to, piece: move.piece } as PieceMove,
		move,
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
