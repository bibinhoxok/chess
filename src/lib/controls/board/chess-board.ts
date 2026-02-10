import { Board, Piece } from "@/lib/types/main"
import { bishop } from "../pieces/bishop"
import { king } from "../pieces/king"
import { knight } from "../pieces/knight"
import { pawn } from "../pieces/pawn"
import { queen } from "../pieces/queen"
import { rook } from "../pieces/rook"

const initialPieces = (): (Piece | null)[][] => {
	const board: (Piece | null)[][] = Array(8)
		.fill(null)
		.map(() => Array(8).fill(null))

	// White pieces
	board[0] = [
		rook("white"),
		knight("white"),
		bishop("white"),
		queen("white"),
		king("white"),
		bishop("white"),
		knight("white"),
		rook("white"),
	]
	board[1] = Array(8)
		.fill(null)
		.map((_, i) => pawn("white"))

	// Black pieces
	board[7] = [
		rook("black"),
		knight("black"),
		bishop("black"),
		queen("black"),
		king("black"),
		bishop("black"),
		knight("black"),
		rook("black"),
	]
	board[6] = Array(8)
		.fill(null)
		.map((_, i) => pawn("black"))

	return board
}

export const chessBoard = (): Board => ({
	currentPieces: initialPieces(),
	selectedPiece: null,
	selectedSquare: null,
	possibleMoves: [],
	currentPlayer: "white",
	gameHistory: [],
	gameStatus: "ongoing",
	capturedPiece: []
})
