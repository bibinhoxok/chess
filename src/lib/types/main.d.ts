export type Square = {
	col: number
	row: number
}

export type Color = "white" | "black"

export type PieceName = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'

export type PieceMove = {
	from: Square
	to: Square
	piece: Piece
}

export type RegularMove = PieceMove & {
	type: 'regular'
	capturedPiece?: Piece
}

export type PromotionMove = PieceMove & {
	type: 'promotion'
	promotionTo: Piece
	capturedPiece?: Piece
}

export type CastlingMove = {
	type: 'castling'
	kingMove: PieceMove
	rookMove: PieceMove
}

export type EnPassantMove = PieceMove & {
	type: 'enPassant'
	capturedPiece: Piece // the captured pawn
}

export type Move = RegularMove | PromotionMove | CastlingMove | EnPassantMove;
export type GameStatus = 'checkmate' | 'stalemate' | 'insufficient material' | 'ongoing'

export type Board = {
	selectedPiece: Piece | null
	selectedSquare: Square | null
	possibleMoves: Square[]
	currentPieces: (Piece | null)[][]
	currentPlayer: Color
	gameHistory: Move[]
	gameStatus: GameStatus
}

export type Piece = {
	color: Color
	name: PieceName
	value: number
}
