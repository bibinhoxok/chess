import { Board, Color, Piece, Square } from "@/lib/types/main"
import { isSquareOnBoard } from "./board/conditions"

export const getPieceAt = (square: Square, board: Board): Piece | null => {
    if (!isSquareOnBoard(square)) return null
    return board.currentPieces[square.row][square.col]
}

export const getStraightMovesInDirection = (from: Square, direction: { col: number, row: number }, board: Board, color: Color): Square[] => {
    // Generate all squares in a given direction
    const squaresInDirection = Array.from({ length: 7 }, (_, i) => ({
        col: from.col + direction.col * (i + 1),
        row: from.row + direction.row * (i + 1)
    }))

    // Take squares until we go off the board
    const firstOffBoardIndex = squaresInDirection.findIndex(sq => !isSquareOnBoard(sq))
    const onBoardSquares = firstOffBoardIndex === -1 ? squaresInDirection : squaresInDirection.slice(0, firstOffBoardIndex)

    // Find the first piece in the path
    const firstPieceIndex = onBoardSquares.findIndex(square => getPieceAt(square, board))

    // If no piece is found, all squares on the board in this direction are valid
    if (firstPieceIndex === -1) {
        return onBoardSquares
    }

    // Include the square with the piece if it's an opponent's piece
    const blockingPiece = getPieceAt(onBoardSquares[firstPieceIndex], board)
    const isOpponentsPiece = blockingPiece && blockingPiece.color !== color

    // If a piece is found, take all squares until that piece
    const moves = onBoardSquares.slice(0, isOpponentsPiece ? firstPieceIndex + 1 : firstPieceIndex)

    return moves
}

export const getSingleMoveInDirection = (from: Square, direction: { col: number, row: number }, board: Board, color: Color): Square[] => {
    const to = {
        col: from.col + direction.col,
        row: from.row + direction.row
    }

    if (!isSquareOnBoard(to)) return []

    const pieceAtTarget = getPieceAt(to, board)

    if (pieceAtTarget === null) return [to]

    if (pieceAtTarget.color !== color) return [to]

    return []
}
