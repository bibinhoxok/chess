import { Board, Color, Piece, Square } from "@/lib/types/main"
import { getPieceAt } from "../utils"
import { isSquareOnBoard } from "../board/conditions"
import { isEnPassant } from "../board/specialMoveConditions"

export const getPawnForwardMoves = (color: Color, from: Square, board: Board): Square[] => {
    const oneSquareForward = color === 'white' ? 1 : -1
    const startRank = color === 'white' ? 1 : 6
    const twoSquaresForward = color === 'white' ? 2 : -2

    const directions = startRank === from.rank ? [
        { file: 0, rank: oneSquareForward },
        { file: 0, rank: twoSquaresForward }
    ] : [
        { file: 0, rank: oneSquareForward }
    ]
    const getMove = (direction: { file: number, rank: number }) => {
        const to = {
            file: from.file + direction.file,
            rank: from.rank + direction.rank
        }
        if (!isSquareOnBoard(to)) return []
        if(direction.rank === twoSquaresForward && getMove({ file: 0, rank: oneSquareForward })?.length === 0) return []
        const pieceAtTarget = getPieceAt(to, board)
        if (pieceAtTarget === null) return [to]
        return []
    }
    return directions.flatMap(direction =>getMove(direction))
}

export const getPawnCaptureMoves = (color: Color, from: Square, board: Board): Square[] => {
    const forward = color === 'white' ? 1 : -1
    const captureDirections = [-1, 1]
    const directions = captureDirections.map(direction => ({ file: direction, rank: forward }))
    return directions.flatMap(direction => {
        const to = {
            file: from.file + direction.file,
            rank: from.rank + direction.rank
        }
        if (!isSquareOnBoard(to)) return []
        const pieceAtTarget = getPieceAt(to, board)
        if (pieceAtTarget === null) return []
        if (pieceAtTarget.color !== color) return [to]
        return []
    })
}

export const getEnPassantMove = (color: Color, from: Square, board: Board): Square[] => {
    const forward = color === 'white' ? 1 : -1
    const captureDirections = [-1, 1]
    const directions = captureDirections.map(direction => ({ file: direction, rank: forward }))
    return directions.flatMap(direction => {
        const to = {
            file: from.file + direction.file,
            rank: from.rank + direction.rank
        }
        if (!isSquareOnBoard(to)) return []
        if (isEnPassant(board, getPieceAt(from, board) as Piece, { file: from.file + direction.file, rank: from.rank} as Square)) return [to]
        return []
    })
}

const getPossibleMoves = (color: Color, from: Square, board: Board): Square[] => {
    return [
        ...getPawnForwardMoves(color, from, board),
        ...getPawnCaptureMoves(color, from, board),
        ...getEnPassantMove(color, from, board)
    ]
}

export const pawn = (color: Color, currentSquare: Square): Piece => ({
    color,
    name: "pawn",
    currentSquare,
    value: 1,
    getPossibleMoves
})
