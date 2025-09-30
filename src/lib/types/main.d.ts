export type Square = {
    file: number
    rank: number
}

export type Color = "white" | "black"

export type PieceName = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'

export type Move = {
    from: Square
    to: Square
    piece: Piece
    capturedPiece?: Piece
    specialMoveType: 'castling' | 'enPassant' | 'promotion' | 'none'
}
export type GameStatus = 'checkmate' | 'stalemate' | 'insufficient material' | 'ongoing'

export type Board = {
  selectedPiece: Piece | null
  possibleMoves: Square[]
    currentPieces: (Piece | null)[][]
    currentPlayer: Color
    gameHistory: Move[]
    gameStatus: GameStatus
}

export type Piece = {
    color: Color
    name: pieceName
    currentSquare: Square
    value: number
    getPossibleMoves: (color: Color, from: Square, board: Board) => Square[]
}