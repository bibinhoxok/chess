import { Board, Move, Piece, Square } from "@/lib/types/main";
import { bishop } from "../pieces/bishop";
import { king } from "../pieces/king";
import { knight } from "../pieces/knight";
import { pawn } from "../pieces/pawn";
import { queen } from "../pieces/queen";
import { rook } from "../pieces/rook";

const initialPieces = (): (Piece | null)[][] => {
    const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

    // White pieces
    board[0] = [
        rook('white', { file: 0, rank: 0 }),
        knight('white', { file: 1, rank: 0 }),
        bishop('white', { file: 2, rank: 0 }),
        queen('white', { file: 3, rank: 0 }),
        king('white', { file: 4, rank: 0 }),
        bishop('white', { file: 5, rank: 0 }),
        knight('white', { file: 6, rank: 0 }),
        rook('white', { file: 7, rank: 0 }),
    ];
    board[1] = Array(8).fill(null).map((_, i) => pawn('white', { file: i, rank: 1 }));



    // Black pieces
    board[7] = [
        rook('black', { file: 0, rank: 7 }),
        knight('black', { file: 1, rank: 7 }),
        bishop('black', { file: 2, rank: 7 }),
        queen('black', { file: 3, rank: 7 }),
        king('black', { file: 4, rank: 7 }),
        bishop('black', { file: 5, rank: 7 }),
        knight('black', { file: 6, rank: 7 }),
        rook('black', { file: 7, rank: 7 }),
    ];
    board[6] = Array(8).fill(null).map((_, i) => pawn('black', { file: i, rank: 6 }));

    return board;
}

export const chessBoard = (): Board => ({
    currentPieces: initialPieces(),
    selectedPiece: null,
    possibleMoves: [],
    currentPlayer: "white",
    gameHistory: [],
    gameStatus: "ongoing"
})
