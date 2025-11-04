import { create } from 'zustand'
import { Board, Square, Piece, Move } from '@/lib/types/main'
import { chessBoard } from '@/lib/controls/board/chessBoard'
import { movePiece } from '../controls/board/moves'

type BoardState = Board & {
	movePiece: (move: Move) => void
	setBoard: (board: Board) => void
	selectPiece: (piece: Piece) => void
}

const useChessboard = create<BoardState>((set) => ({
	...chessBoard(),
	setBoard: (board: Board) => set(board),
	movePiece: (move) => set((state) => ({ ...movePiece(state, move), selectedPiece: null })),
	selectPiece: (piece) =>
		set((state) => {
			const moves = piece.getPossibleMoves(piece.color, piece.currentSquare, state)
			return { selectedPiece: piece, possibleMoves: moves }
		}),
}))

export default useChessboard
