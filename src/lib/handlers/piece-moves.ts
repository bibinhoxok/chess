import {
	createCastlingMove,
	createEnPassantMove,
	createRegularMove,
} from "@/lib/controls/board/moves"
import { getMoveType } from "../controls/board/special-move-conditions"
import {
	Board,
	CastlingMove,
	EnPassantMove,
	PieceMove,
	PromotionMove,
	RegularMove,
	Square,
} from "../types/main"

export const handlePieceMove = (
	board: Board,
	from: Square,
	to: Square,
	movePiece: (
		move: RegularMove | PromotionMove | CastlingMove | EnPassantMove,
	) => void,
	setPromotionSquare: (square: Square) => void,
) => {
	const pieceMove: PieceMove = { from, to }
	const moveType = getMoveType(board, pieceMove)
	const handleCastlingMove = () => {
		const kingMove: PieceMove = { from, to }
		const rookCol = to.col > from.col ? 7 : 0
		const rookToCol = to.col > from.col ? 5 : 3
		const rookSquare = { row: from.row, col: rookCol }
		const rookMove: PieceMove = {
			from: rookSquare,
			to: { row: from.row, col: rookToCol },
		}
		const castlingMove = createCastlingMove(kingMove, rookMove)
		movePiece(castlingMove)
	}
	const handleEnPassantMove = () => {
		const capturedSquare: Square = { row: from.row, col: to.col }
		const enPassantMove = createEnPassantMove(from, to, capturedSquare)
		movePiece(enPassantMove)
	}

	const handlePromotionMove = () => {
		setPromotionSquare(to)
	}

	const handleRegularMove = () => {
		const regularMove = createRegularMove(
			from,
			to,
			board.currentPieces[to.row][to.col] || undefined,
		)
		movePiece(regularMove)
	}

	const handleMove = {
		castling: handleCastlingMove,
		enPassant: handleEnPassantMove,
		promotion: handlePromotionMove,
		regular: handleRegularMove,
	}
	handleMove[moveType]()
}
