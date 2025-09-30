import { create } from 'zustand'
import { Board, Square, Piece } from '@/lib/types/main'
import { chessBoard } from '@/lib/controls/board/chessBoard'
import { movePiece } from '../controls/board/moves'

type BoardState = Board & {
	movePiece: (from: Square, to: Square) => void
	setBoard: (board: Board) => void
	selectPiece: (piece: Piece) => void
}

const useChessboard = create<BoardState>((set) => ({
	...chessBoard(),
	setBoard: (board: Board) => set(board),
	movePiece: (from, to) => set((state) => ({ ...movePiece(from, to, state), selectedPiece: null })),
	selectPiece: (piece) =>
		set((state) => {
			if (state.selectedPiece && state.selectedPiece.currentSquare.rank === piece.currentSquare.rank && state.selectedPiece.currentSquare.file === piece.currentSquare.file) {
				return { selectedPiece: null, possibleMoves: [] }
			}
			const moves = piece.getPossibleMoves(piece.color, piece.currentSquare, state)
			return { selectedPiece: piece, possibleMoves: moves }
		}),
}))

export default useChessboard
