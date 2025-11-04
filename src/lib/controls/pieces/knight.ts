import { Board, Color, Piece, Square } from "@/lib/types/main";
import { getSingleMoveInDirection } from "../utils";

const getPossibleMoves = (color: Color, from: Square, board: Board): Square[] => {
    const directions = [
        { col: 1, row: 2 },
        { col: 1, row: -2 },
        { col: -1, row: 2 },
        { col: -1, row: -2 },
        { col: 2, row: 1 },
        { col: 2, row: -1 },
        { col: -2, row: 1 },
        { col: -2, row: -1 }
    ];
    return directions.flatMap(direction => getSingleMoveInDirection(from, direction, board, color));
}

export const knight = (color: Color, currentSquare: Square): Piece => ({
    color,
    name: "knight",
    currentSquare,
    value: 3,
    getPossibleMoves
});
