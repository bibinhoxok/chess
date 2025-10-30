import { Board, Piece, Move, RegularMove, PromotionMove, PieceMove, CastlingMove, EnPassantMove } from "@/lib/types/main";

const createNewCurrentPieces = (board: Board, pieceMoves: PieceMove[], promotePiece?: Piece) => {
    //Create a deep copy of the pieces array to ensure immutability
    const newPieces = board.currentPieces.map(row => [...row]);

    pieceMoves.forEach(pieceMove => {
        //Update the piece's internal state with the new square
        let movedPiece: Piece = {
            ...pieceMove.piece,
            currentSquare: pieceMove.to
        };
        if (promotePiece) {
            movedPiece.name = promotePiece.name
            movedPiece.value = promotePiece.value
        }
        //Update the board array
        newPieces[pieceMove.to.rank][pieceMove.to.file] = movedPiece;
        newPieces[pieceMove.from.rank][pieceMove.from.file] = null;
    })

    //Return the new board state
    return newPieces
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
    currentPieces: createNewCurrentPieces(board, [{ from: move.capturedPiece.currentSquare, to: move.to, piece: move.piece } as PieceMove, move]), 
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

export const undoMove = (board: Board): Board => {
    return board
}