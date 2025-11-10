import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getPieceAt, getSingleMoveInDirection } from "../utils"
import { isCastling } from "../board/specialMoveConditions";



export const getPossibleKingMoves = (piece: Piece, board: Board): Square[] => {
    const { color, currentSquare: from } = piece;
    const directions = [
        { col: 1, row: 0 },   // Right
        { col: -1, row: 0 },  // Left
        { col: 0, row: 1 },   // Up
        { col: 0, row: -1 },  // Down
        { col: 1, row: 1 },   // Up-Right
        { col: 1, row: -1 },  // Down-Right
        { col: -1, row: 1 },  // Up-Left
        { col: -1, row: -1 }  // Down-Left
    ];
    const kingPiece = board.currentPieces[from.row][from.col];
    if (!kingPiece) return [];

    const castlingMoves = board.currentPieces
        .flat()
        .filter((p): p is Piece => p !== null && p.name === 'rook' && p.color === color)
        .filter(rook => isCastling(board, kingPiece, rook))
        .map(rook => {
            const direction = Math.sign(rook.currentSquare.col - from.col);
            return { row: from.row, col: from.col + 2 * direction };
        });

    const moves = directions.flatMap(direction => getSingleMoveInDirection(from, direction, board, color)).concat(castlingMoves);

    return moves;
}

export const king = (color: Color, currentSquare: Square): Piece => ({
    color,
    name: "king",
    currentSquare,
    value: 1000, // King is invaluable
})