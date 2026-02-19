import type {
	Board,
	PieceName,
	Square,
	Move,
	PieceMove,
} from "@/lib/types/main"
import { chessBoard } from "@/lib/controls/board/chess-board"
import { movePiece, findMovingPiece } from "@/lib/controls/board/moves"
import { getPieceAt } from "@/lib/controls/board/utils"
import { pieces } from "../controls/pieces"
import { getMoveType } from "@/lib/controls/board/special-move-conditions"
import { pieceDic } from "@/lib/utils/dictionaries"
import {
	createCastlingMove,
	createPromotionMove,
	createEnPassantMove,
	createRegularMove,
} from "@/lib/controls/board/moves"
import { PGNObject } from "@/lib/zod/PGNSchema"
import { pgnRegex, sanRegex } from "../utils/regex"

const test = `[Event "F/S Return Match"]
[Site "Belgrade, Serbia JUG"]
[Date "1992.11.04"]
[Round "29"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1/2-1/2"]

1.e4 e5 2.Nf3 Nc6 3.Bb5 {This opening is called the Ruy Lopez.} 3...a6
4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7
11.c4 c6 12.cxb5 axb5 13.Nc3 Bb7 14.Bg5 b4 15.Nb1 h6 16.Bh4 c5 17.dxe5
Nxe4 18.Bxe7 Qxe7 19.exd6 Qf6 20.Nbd2 Nxd6 21.Nc4 Nxc4 22.Bxc4 Nb6
23.Ne5 Rae8 24.Bxf7+ Rxf7 25.Nxf7 Rxe1+ 26.Qxe1 Kxf7 27.Qe3 Qg5 28.Qxg5
hxg5 29.b3 Ke6 30.a3 Kd6 31.axb4 cxb4 32.Ra5 Nd5 33.f3 Bc8 34.Kf2 Bf5
35.Ra7 g6 36.Ra6+ Kc5 37.Ke1 Nf4 38.g3 Nxh3 39.Kd2 Kb5 40.Rd6 Kc5 41.Ra6
Nf2 42.g4 Bd3 43.Re6 1/2-1/2`

export const PGNToJSON = (PGNString: string) => {
	const matches = [...PGNString.matchAll(pgnRegex)]

	const metadata: Record<string, string> = {}
	const moves: string[] = []

	for (const match of matches) {
		if (match[1]) {
			metadata[match[1]] = match[2]
		}
		if (match[6]) {
			moves.push(match[6])
		}
	}

	return { metadata, moves }
}

const getMoveFromSAN = (board: Board, moveString: string): Move | null => {
	if (moveString === "O-O" || moveString === "O-O-O") {
		const row = board.currentPlayer === "white" ? 0 : 7
		const isKingside = moveString === "O-O"
		const kingStart: Square = { row, col: 4 }
		const kingEnd: Square = { row, col: isKingside ? 6 : 2 }
		const rookStart: Square = { row, col: isKingside ? 7 : 0 }
		const rookEnd: Square = { row, col: isKingside ? 5 : 3 }
		return createCastlingMove(
			{ from: kingStart, to: kingEnd },
			{ from: rookStart, to: rookEnd },
		)
	}

	const match = moveString.match(sanRegex)
	if (!match) return null

	const pieceChar = match[1]
	const fromFile = match[2]
	const fromRank = match[3]
	const targetSquareStr = match[4]
	const promotionStr = match[5]

	const targetCol = targetSquareStr.charCodeAt(0) - "a".charCodeAt(0)
	const targetRow = parseInt(targetSquareStr[1]) - 1
	const target: Square = { col: targetCol, row: targetRow }

	const pieceName = pieceDic[(pieceChar ?? "") as keyof typeof pieceDic]
	const from = findMovingPiece(board, pieceName, target, fromFile, fromRank)
	if (!from) {
		console.warn(`Could not find piece for move ${moveString}`)
		return null
	}

	const capturedPiece = getPieceAt(target, board) || undefined

	const pieceMove: PieceMove = { from, to: target }
	const moveType = getMoveType(board, pieceMove)
	if (moveType === "promotion") {
		const promoteType = promotionStr.substring(1) // Remove '='
		const promotionTo = pieceDic[promoteType as keyof typeof pieceDic]
		const promotionPiece = pieces[promotionTo](board.currentPlayer)
		return createPromotionMove(from, target, promotionPiece, capturedPiece)
	}
	if (moveType === "enPassant") {
		const capturedSquare: Square = { row: from.row, col: target.col }
		return createEnPassantMove(from, target, capturedSquare)
	}
	if (moveType === "regular") {
		return createRegularMove(from, target, capturedPiece)
	}

	return createRegularMove(from, target, capturedPiece)
}

export const createBoardFromPGN = (pgn: PGNObject): Board =>
	pgn.moves.reduce((board, moveString) => {
		const cleanMove = moveString.replace(/[+#]/g, "")
		const move = getMoveFromSAN(board, cleanMove)
		if (move) {
			board = movePiece(board, move)
		}
		return board
	}, chessBoard())
