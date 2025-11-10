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
		rook('white', { col: 0, row: 0 }),
		knight('white', { col: 1, row: 0 }),
		bishop('white', { col: 2, row: 0 }),
		queen('white', { col: 3, row: 0 }),
		king('white', { col: 4, row: 0 }),
		bishop('white', { col: 5, row: 0 }),
		knight('white', { col: 6, row: 0 }),
		rook('white', { col: 7, row: 0 }),
	];
	board[1] = Array(8).fill(null).map((_, i) => pawn('white', { col: i, row: 1 }));



	// Black pieces
	board[7] = [
		rook('black', { col: 0, row: 7 }),
		knight('black', { col: 1, row: 7 }),
		bishop('black', { col: 2, row: 7 }),
		queen('black', { col: 3, row: 7 }),
		king('black', { col: 4, row: 7 }),
		bishop('black', { col: 5, row: 7 }),
		knight('black', { col: 6, row: 7 }),
		rook('black', { col: 7, row: 7 }),
	];
	board[6] = Array(8).fill(null).map((_, i) => pawn('black', { col: i, row: 6 }));

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
