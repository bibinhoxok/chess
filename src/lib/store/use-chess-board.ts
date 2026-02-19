import { create } from "zustand"
import {
	Board,
	Square,
	Piece,
	Move,
	PieceName,
	PromotionMove,
} from "@/lib/types/main"
import { chessBoard } from "@/lib/controls/board/chess-board"
import {
	getPossibleMoves,
	movePiece,
	redoMove,
	undoMove,
	createPromotionMove,
} from "../controls/board/moves"
import { pieces } from "../controls/pieces"
import { isCheckedMate, checkGameStatus } from "../controls/board/conditions"

type BoardState = Board & {
	movePiece: (move: Move) => void
	setBoard: (board: Board) => void
	selectPiece: (from: Square, piece: Piece) => void
	promotionSquare: Square | null
	setPromotionSquare: (square: Square | null) => void
	handlePromotion: (promotionTo: PieceName) => void
	undo: () => void
	restart: () => void
	redo: () => void
}

const useChessboard = create<BoardState>((set, get) => ({
	...chessBoard(),
	promotionSquare: null,
	setBoard: (board: Board) => set(board),
	movePiece: (move) =>
		set((state) => {
			const nextBoard = movePiece(state, move)
			const gameStatus = checkGameStatus(nextBoard)
			return {
				...nextBoard,
				gameStatus,
				selectedPiece: null,
				selectedSquare: null,
			}
		}),
	selectPiece: (from, piece) =>
		set((state) => {
			const deselected = {
				selectedPiece: null,
				selectedSquare: null,
				possibleMoves: [],
			}
			if (isCheckedMate(state)) return deselected
			const moves = getPossibleMoves(from, state)
			if (moves.length < 1) return deselected
			return {
				selectedPiece: piece,
				selectedSquare: from,
				possibleMoves: moves,
			}
		}),
	setPromotionSquare: (square) => set({ promotionSquare: square }),
	handlePromotion: (promotionTo: PieceName) => {
		const state = get()
		const from = state.selectedSquare
		const to = state.promotionSquare
		const piece = state.selectedPiece

		if (!from || !to || !piece) return

		const promotionMove = createPromotionMove(
			from,
			to,
			pieces[promotionTo](piece.color),
			state.currentPieces[to.row][to.col] || undefined,
		)
		set((state) => {
			const nextBoard = movePiece(state, promotionMove)
			const gameStatus = checkGameStatus(nextBoard)
			return {
				...nextBoard,
				gameStatus,
				selectedPiece: null,
				selectedSquare: null,
				promotionSquare: null,
			}
		})
	},
	undo: () =>
		set((state) => {
			const nextBoard = undoMove(state)
			const gameStatus = checkGameStatus(nextBoard)
			return {
				...nextBoard,
				gameStatus,
				selectedPiece: null,
				selectedSquare: null,
				promotionSquare: null,
				possibleMoves: [],
			}
		}),
	restart: () => set(chessBoard()),
	redo: () =>
		set((state) => {
			const nextBoard = redoMove(state)
			const gameStatus = checkGameStatus(nextBoard)
			return {
				...nextBoard,
				gameStatus,
				selectedPiece: null,
				selectedSquare: null,
				promotionSquare: null,
				possibleMoves: [],
			}
		}),
}))

export default useChessboard
