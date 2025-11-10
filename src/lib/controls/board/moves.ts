import { Board, Piece, Move, RegularMove, PromotionMove, PieceMove, CastlingMove, EnPassantMove } from "@/lib/types/main";

export const createNewCurrentPieces = (board: Board, pieceMoves: PieceMove[], promotePiece?: Piece) => {
	return board.currentPieces.map((row, rowIndex) => {
		return row.map((piece, colIndex) => {
			const landingMove = pieceMoves.findLast(move => move.to.row === rowIndex && move.to.col === colIndex)
			if (landingMove) {
				if (promotePiece) {
					return promotePiece
				}
				return landingMove.piece
			}
			if (pieceMoves.some(move => move.from.row === rowIndex && move.from.col === colIndex)) {
				return null
			}
			return piece
		})
	});
}

const regularMove = (board: Board, move: RegularMove): Board => ({
	...board,
	currentPieces: createNewCurrentPieces(board, [move]),
	currentPlayer: board.currentPlayer === 'white' ? 'black' : 'white',
	gameHistory: [...board.gameHistory, move]
})

const promotionMove = (board: Board, move: PromotionMove): Board => ({
	...board,
	currentPieces: createNewCurrentPieces(board, [move], move.promotionTo),
	currentPlayer: board.currentPlayer === 'white' ? 'black' : 'white',
	gameHistory: [...board.gameHistory, move]
})
const castlingMove = (board: Board, move: CastlingMove): Board => ({
	...board,
	currentPieces: createNewCurrentPieces(board, [move.kingMove, move.rookMove]),
	currentPlayer: board.currentPlayer === 'white' ? 'black' : 'white',
	gameHistory: [...board.gameHistory, move]
})

const enPassantMove = (board: Board, move: EnPassantMove): Board => ({
	...board,
	//Move the captured piece to the destination first, then the pawn move and capture it
	currentPieces: createNewCurrentPieces(board, [{ from: move.from, to: move.to, piece: move.piece } as PieceMove, move]),
	currentPlayer: board.currentPlayer === 'white' ? 'black' : 'white',
	gameHistory: [...board.gameHistory, move]
})

export const movePiece = (board: Board, move: Move): Board => {
	const moves = {
		'regular': () => regularMove(board, move as RegularMove),
		'promotion': () => promotionMove(board, move as PromotionMove),
		'castling': () => castlingMove(board, move as CastlingMove),
		'enPassant': () => enPassantMove(board, move as EnPassantMove)
	}
	return moves[move.type]();
}

// Under construction
export const undoMove = (board: Board): Board => {
	return board
}