import { Square, Board, Piece, Move, Color } from "@/lib/types/main";
import { getPieceAt } from "../utils";
import { isValidMove } from "./conditions";



export const movePiece = (from: Square, to: Square, board: Board): Board => {
    const pieceToMove = getPieceAt(from, board);
    
    //Check if a piece exists at the 'from' square and if the move is valid
    if (!pieceToMove || !isValidMove(pieceToMove.getPossibleMoves, pieceToMove.color, from, board, to) || pieceToMove.color !== board.currentPlayer) {
        return board; // Return original board if move is invalid
    }

    //Create a deep copy of the pieces array to ensure immutability
    const newPieces = board.currentPieces.map(row => [...row]);

    //Get the captured piece, if any
    const capturedPiece = getPieceAt(to, board);

    //Update the piece's internal state with the new square
    const movedPiece: Piece = {
        ...pieceToMove,
        currentSquare: to
    };

    //Update the board array
    newPieces[to.rank][to.file] = movedPiece;
    newPieces[from.rank][from.file] = null;

    //Create the move object for the history
    const move: Move = {
        from,
        to,
        piece: movedPiece,
        capturedPiece: capturedPiece || undefined,
        specialMoveType: 'none'
    }

    //Return the new board state
    return {
        ...board,
        currentPieces: newPieces,
        currentPlayer: board.currentPlayer === 'white' ? 'black' : 'white',
        gameHistory: [...board.gameHistory, move]
    };
}