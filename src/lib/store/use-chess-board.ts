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
import { getPossibleMoves, movePiece } from "../controls/board/moves"
import { pieces } from "../controls/pieces"
import { isCheckedMate } from "../controls/board/conditions"

type BoardState = Board & {
	movePiece: (move: Move) => void
	setBoard: (board: Board) => void
	selectPiece: (from: Square, piece: Piece) => void
	promotionSquare: Square | null
	setPromotionSquare: (square: Square | null) => void
	handlePromotion: (promotionTo: PieceName) => void
}

const useChessboard = create<BoardState>((set, get) => ({
	...chessBoard(),
	promotionSquare: null,
	setBoard: (board: Board) => set(board),
	movePiece: (move) =>
		set((state) => ({
			...movePiece(state, move),
			selectedPiece: null,
			selectedSquare: null,
		})),
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

		const promotionMove: PromotionMove = {
			type: "promotion",
			from,
			to,
			promotionTo: pieces[promotionTo](piece.color),
			capturedPiece: state.currentPieces[to.row][to.col] || undefined,
		}
		set((state) => ({
			...movePiece(state, promotionMove),
			selectedPiece: null,
			selectedSquare: null,
			promotionSquare: null,
		}))
	},
}))

export default useChessboard
