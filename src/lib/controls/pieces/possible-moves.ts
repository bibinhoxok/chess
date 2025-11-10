import {
	getPossibleBishopMoves,
	getPossibleKingMoves,
	getPossibleKnightMoves,
	getPossiblePawnMoves,
	getPossibleQueenMoves,
	getPossibleRookMoves,
} from "."
import { Board, Piece, Square } from "../../types/main"

export const getPossibleMoves = (from: Square, piece: Piece, board: Board): Square[] => {
	if (!piece) return []
	const moves = {
		"pawn": getPossiblePawnMoves,
		"rook": getPossibleRookMoves,
		"knight": getPossibleKnightMoves,
		"bishop": getPossibleBishopMoves,
		"queen": getPossibleQueenMoves,
		"king": getPossibleKingMoves
	}
	return moves[piece.name](from, piece, board)
}
