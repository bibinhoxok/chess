import { Square, Color, Board, Piece, GameStatus } from "@/lib/types/main"
import { getPawnCaptureMoves } from "@/lib/controls/pieces/pawn"
import { getPossibleMoves } from "../pieces/possible-moves"


export const isSquareOnBoard = (square: Square) => {
	return square.col >= 0 && square.col < 8 &&
		square.row >= 0 && square.row < 8
}

const isPseudoLegalMove = (from: Square, piece: Piece, board: Board, to: Square) => {
	const possibleMoves = getPossibleMoves(from, piece, board)
	return possibleMoves.some(move => move.col === to.col && move.row === to.row)
}

export const isSquareThreatened = (board: Board, square: Square, defendingColor: Color) => {
	const attackingColor: Color = defendingColor === "white" ? "black" : "white"
	return board.currentPieces.some((row, rowIndex) => {
		return row.some((piece, colIndex) => {
			if (piece && piece.color === attackingColor) {
				const from = { row: rowIndex, col: colIndex };
				if (piece.name === 'pawn') {
					if (getPawnCaptureMoves(piece.color, from, board).some(move => move.col === square.col && move.row === square.row)) {
						return true;
					}
				} else {
					if (isPseudoLegalMove(from, piece, board, square)) {
						return true;
					}
				}
			}
			return false
		})
	})
}

const findKingSquare = (pieces: Board['currentPieces'], color: Color): Square | null => {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = pieces[r][c];
            if (piece && piece.name === 'king' && piece.color === color) {
                return { row: r, col: c };
            }
        }
    }
    return null;
};

const simulateMove = (board: Board, from: Square, to: Square): Board => {
    const pieceToMove = board.currentPieces[from.row][from.col];
    if (!pieceToMove) return board;

    const newPieces = board.currentPieces.map(row => [...row]);
    newPieces[to.row][to.col] = pieceToMove;
    newPieces[from.row][from.col] = null;
    
    return { ...board, currentPieces: newPieces };
}

export const isValidMove = (from: Square, piece: Piece, board: Board, to: Square) => {
	if (!piece || !isPseudoLegalMove(from, piece, board, to)) {
		return false;
	}

	const boardAfterMove = simulateMove(board, from, to);
    const kingSquare = piece.name === 'king' ? to : findKingSquare(boardAfterMove.currentPieces, piece.color);

	if (!kingSquare) return true;

	return !isSquareThreatened(boardAfterMove, kingSquare, piece.color);
};

const hasValidMoves = (board: Board) => {
	return board.currentPieces.some((row, r) => 
		row.some((piece, c) => {
			if (piece && piece.color === board.currentPlayer) {
				const from = { row: r, col: c };
				const possibleMoves = getPossibleMoves(from, piece, board);
				return possibleMoves.some(move => isValidMove(from, piece, board, move));
			}
			return false;
		})
	);
}


export const isChecked = (board: Board) => {
	const kingSquare = findKingSquare(board.currentPieces, board.currentPlayer);
	if (!kingSquare) return false
	return isSquareThreatened(board, kingSquare, board.currentPlayer)
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
	const piecesWithSquares = board.currentPieces.flatMap((row, r) =>
        row.map((piece, c) => (piece ? { piece, square: { row: r, col: c } } : null))
    ).filter((item): item is { piece: Piece; square: Square } => item !== null);

	const nonKingPieces = piecesWithSquares.filter(p => p.piece.name !== 'king')
	const whiteNonKingPieces = nonKingPieces.filter(p => p.piece.color === 'white')
	const blackNonKingPieces = nonKingPieces.filter(p => p.piece.color === 'black')

	// Case 1: King vs King
	if (nonKingPieces.length === 0) {
		return true
	}

	// Case 2: King + single minor piece vs King
	if (nonKingPieces.length === 1) {
		const lonePiece = nonKingPieces[0].piece
		if (lonePiece.name === 'bishop' || lonePiece.name === 'knight') {
			return true
		}
	}

	// Case 3: King + two knights vs King
	if (nonKingPieces.length === 2
		&& (whiteNonKingPieces.length === 2 || blackNonKingPieces.length === 2)
		&& nonKingPieces.every(p => p.piece.name === 'knight')) {
		return true
	}

	// Case 4: Both sides only have bishops, and all are on same-colored squares.
	const bishops = nonKingPieces.filter(p => p.piece.name === 'bishop')
	if (bishops.length > 0 && bishops.length === nonKingPieces.length) {
		const firstBishopSquareColor = (bishops[0].square.row + bishops[0].square.col) % 2
		return bishops.every(b => {
			const color = (b.square.row + b.square.col) % 2
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