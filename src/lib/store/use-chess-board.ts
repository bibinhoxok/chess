import { create } from 'zustand'
import { Board, Square, Piece, Move } from '@/lib/types/main'
import { chessBoard } from '@/lib/controls/board/chess-board'
import { movePiece } from '../controls/board/moves'
import { getPossibleMoves } from '../controls/pieces/possible-moves'

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
			const moves = getPossibleMoves(piece, state)
			return { selectedPiece: piece, possibleMoves: moves }
		}),
}))

export default useChessboard
