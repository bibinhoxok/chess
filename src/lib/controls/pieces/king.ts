import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getPieceAt, getSingleMoveInDirection } from "../utils"
import { isCastling } from "../board/specialMoveConditions";



const getPossibleMoves = (color: Color, from: Square, board: Board): Square[] => {
    const directions = [
        { file: 1, rank: 0 },   // Right
        { file: -1, rank: 0 },  // Left
        { file: 0, rank: 1 },   // Up
        { file: 0, rank: -1 },  // Down
        { file: 1, rank: 1 },   // Up-Right
        { file: 1, rank: -1 },  // Down-Right
        { file: -1, rank: 1 },  // Up-Left
        { file: -1, rank: -1 }  // Down-Left
    ];
    const castlingMoves = board.currentPieces.flat().flatMap(piece => {
        const kingPiece = board.currentPieces[from.rank][from.file];
        if (kingPiece && piece && piece.name === 'rook' && piece.color === color && isCastling(board, kingPiece, piece)) {
            const direction = Math.sign(piece.currentSquare.file - from.file);
            return [{ rank: from.rank, file: from.file + 2 * direction }];
        }
        return [];
    });

    const moves = directions.flatMap(direction => getSingleMoveInDirection(from, direction, board, color)).concat(castlingMoves);

    return moves;
}

export const king = (color: Color, currentSquare: Square): Piece => ({
    color,
    name: "king",
    currentSquare,
    value: 1000, // King is invaluable
    getPossibleMoves
})