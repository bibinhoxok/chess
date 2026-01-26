import { create } from "zustand"
import {
	Board,
	Square,
	Piece,
	Move,
	PieceName,
	PromotionMove,
	Color,
} from "@/lib/types/main"
import { chessBoard } from "@/lib/controls/board/chess-board"
import { movePiece } from "../controls/board/moves"
import { getPossibleMoves } from "../controls/pieces/possible-moves"
import { pieces } from "../controls/pieces"
import { findKingSquare, isChecked } from "../controls/board/conditions"

type BoardState = Board & {
	movePiece: (move: Move) => void
	setBoard: (board: Board) => void
	selectPiece: (from: Square, piece: Piece) => void
	promotionSquare: Square | null
	setPromotionSquare: (square: Square | null) => void
	handlePromotion: (promotionTo: PieceName) => void
	findCheckedKing: (board: Board) => Square | null
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
			const moves = getPossibleMoves(from, piece, state)
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
			piece,
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
	findCheckedKing: (board) =>
		isChecked(board)
			? findKingSquare(board.currentPieces, board.currentPlayer)
			: null,
}))

export default useChessboard
