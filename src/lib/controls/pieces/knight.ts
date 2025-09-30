import { Board, Color, Piece, Square } from "@/lib/types/main";
import { getSingleMoveInDirection } from "../utils";

const getPossibleMoves = (color: Color, from: Square, board: Board): Square[] => {
    const directions = [
        { file: 1, rank: 2 },
        { file: 1, rank: -2 },
        { file: -1, rank: 2 },
        { file: -1, rank: -2 },
        { file: 2, rank: 1 },
        { file: 2, rank: -1 },
        { file: -2, rank: 1 },
        { file: -2, rank: -1 }
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
