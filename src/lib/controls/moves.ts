import {
	getPossibleBishopMoves,
	getPossibleKingMoves,
	getPossibleKnightMoves,
	getPossiblePawnMoves,
	getPossibleQueenMoves,
	getPossibleRookMoves,
} from "./pieces"
import { Board, Piece, Square } from "../types/main"

export const getPossibleMoves = (piece: Piece, board: Board): Square[] => {
	switch (piece.name) {
		case "pawn":
			return getPossiblePawnMoves(piece, board)
		case "rook":
			return getPossibleRookMoves(piece, board)
		case "knight":
			return getPossibleKnightMoves(piece, board)
		case "bishop":
			return getPossibleBishopMoves(piece, board)
		case "queen":
			return getPossibleQueenMoves(piece, board)
		case "king":
			return getPossibleKingMoves(piece, board)
		default:
			return []
	}
}
