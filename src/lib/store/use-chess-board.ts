import { create } from 'zustand'
import { Board, Square, Piece, Move } from '@/lib/types/main'
import { chessBoard } from '@/lib/controls/board/chess-board'
import { movePiece } from '../controls/board/moves'
import { getPossibleMoves } from '../controls/pieces/possible-moves'

type BoardState = Board & {
	movePiece: (move: Move) => void
	setBoard: (board: Board) => void
	selectPiece: (from: Square, piece: Piece) => void
}

const useChessboard = create<BoardState>((set) => ({
	...chessBoard(),
	setBoard: (board: Board) => set(board),
	movePiece: (move) => set((state) => ({ ...movePiece(state, move), selectedPiece: null, selectedSquare: null })),
	selectPiece: (from, piece) =>
		set((state) => {
			const moves = getPossibleMoves(from, piece, state)
			return { selectedPiece: piece, selectedSquare: from, possibleMoves: moves }
		}),
}))

export default useChessboard
