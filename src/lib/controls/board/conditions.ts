import { Square, Color, Board, Piece, GameStatus } from "@/lib/types/main"
import { getPawnCaptureMoves } from "@/lib/controls/pieces/pawn"


export const isSquareOnBoard = (square: Square) => {
    return square.file >= 0 && square.file < 8 &&
        square.rank >= 0 && square.rank < 8
}

const isPseudoLegalMove = (getPossibleMoves: Piece['getPossibleMoves'], color: Color, from: Square, board: Board, to: Square) => {
    const possibleMoves = getPossibleMoves(color, from, board)
    return possibleMoves.some(move => move.file === to.file && move.rank === to.rank)
}

const isPawnVaildCapture = (board: Board, piece: Piece, square: Square) => (getPawnCaptureMoves(piece.color, piece.currentSquare, board).some(move => move.file === square.file && move.rank === square.rank))


export const isSquareThreatened = (board: Board, square: Square, defendingColor: Color) => {
    const attackingColor: Color = defendingColor === "white" ? "black" : "white"
    return board.currentPieces.flat().some(piece => {
        if (piece && piece.color === attackingColor) {
            if (piece.name === 'pawn' && isPawnVaildCapture(board, piece, square)) return true
            else return isPseudoLegalMove(piece.getPossibleMoves, piece.color, piece.currentSquare, board, square)
        }
        return false
    })
}

export const isValidMove = (getPossibleMoves: Piece['getPossibleMoves'], color: Color, from: Square, board: Board, to: Square) => {
    if (!isPseudoLegalMove(getPossibleMoves, color, from, board, to)) {
        return false
    }

    const piece = board.currentPieces[from.rank][from.file]
    if (!piece) return false

    const capturedPiece = board.currentPieces[to.rank][to.file]
    const originalSquare = piece.currentSquare

    // Simulate the move
    piece.currentSquare = to
    board.currentPieces[to.rank][to.file] = piece
    board.currentPieces[from.rank][from.file] = null

    const king = board.currentPieces.flat().find(p => p && p.name === 'king' && p.color === color)
    let isKingInCheck = false
    if (king) {
        isKingInCheck = isSquareThreatened(board, king.currentSquare, color)
    }

    // Revert the move
    piece.currentSquare = originalSquare
    board.currentPieces[from.rank][from.file] = piece
    board.currentPieces[to.rank][to.file] = capturedPiece

    return !isKingInCheck
}

const hasValidMoves = (board: Board) => {
    const currentPlayerPieces = board.currentPieces.flat().filter(piece => piece && piece.color === board.currentPlayer)
    return currentPlayerPieces.some(piece => {
        if (!piece) return false
        const possibleMoves = piece.getPossibleMoves(piece.color, piece.currentSquare, board)
        return possibleMoves.some(move => isValidMove(piece.getPossibleMoves, piece.color, piece.currentSquare, board, move))
    })
}


export const isChecked = (board: Board) => {
    const king = board.currentPieces.flat().find(piece => piece && piece.name === 'king' && piece.color === board.currentPlayer)
    if (!king) return false
    return isSquareThreatened(board, king.currentSquare, board.currentPlayer)
}

export const isCheckedMate = (board: Board) => {
    if (!isChecked(board)) return false
    return !hasValidMoves(board)
}

export const isStaleMate = (board: Board) => {
    if (isChecked(board)) return false
    return !hasValidMoves(board)
}

export const isInsufficientMaterial = (board: Board) => {
    const pieces = board.currentPieces.flat().flatMap(p => p ? [p] : [])
    const nonKingPieces = pieces.filter(p => p.name !== 'king')
    const whiteNonKingPieces = nonKingPieces.filter(p => p.color === 'white')
    const blackNonKingPieces = nonKingPieces.filter(p => p.color === 'black')

    // Case 1: King vs King
    if (nonKingPieces.length === 0) {
        return true
    }

    // Case 2: King + single minor piece vs King
    if (nonKingPieces.length === 1) {
        const lonePiece = nonKingPieces[0]
        if (lonePiece.name === 'bishop' || lonePiece.name === 'knight') {
            return true
        }
    }

    // Case 3: King + two knights vs King
    if (nonKingPieces.length === 2
        && (whiteNonKingPieces.length === 2 || blackNonKingPieces.length === 2)
        && nonKingPieces.every(p => p.name === 'knight')) {
        return true
    }

    // Case 4: Both sides only have bishops, and all are on same-colored squares.
    const bishops = nonKingPieces.filter(p => p.name === 'bishop')
    if (bishops.length === nonKingPieces.length) {
        const firstBishopSquareColor = (bishops[0].currentSquare.rank + bishops[0].currentSquare.file) % 2
        return bishops.every(b => {
            const color = (b.currentSquare.rank + b.currentSquare.file) % 2
            return color === firstBishopSquareColor
        })
    }

    return false
}

export const checkGameStatus = (board: Board): GameStatus => {
    if (isCheckedMate(board)) return 'checkmate'
    if (isStaleMate(board)) return 'stalemate'
    if (isInsufficientMaterial(board)) return 'insufficient material'
    return 'ongoing'
}