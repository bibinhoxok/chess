import { getMoveType } from "../controls/board/specialMoveConditions";
import { queen } from "../controls/pieces/queen";
import { Board, CastlingMove, EnPassantMove, Piece, PieceMove, PromotionMove, RegularMove, Square } from "../types/main";

export const handlePieceMove= (
    board: Board,
    piece: Piece,
    to: Square,
    movePiece: (move: RegularMove | PromotionMove | CastlingMove | EnPassantMove) => void
) => {
    const from = piece.currentSquare;
    const pieceMove: PieceMove = {
        from,
        to,
        piece,
    };
    const moveType = getMoveType(board, pieceMove);
    const handleCastlingMove = () => {
        const kingMove: PieceMove = {
            from: piece.currentSquare,
            to,
            piece,
        };
        const rookFile = to.file > from.file ? 7 : 0;
        const rookToFile = to.file > from.file ? 5 : 3;
        const rook = board.currentPieces[from.rank][rookFile] as Piece;
        const rookMove: PieceMove = {
            from: rook.currentSquare,
            to: { rank: from.rank, file: rookToFile },
            piece: rook,
        };
        const castlingMove: CastlingMove = {
            type: 'castling',
            kingMove,
            rookMove,
        };
        movePiece(castlingMove);
    }
    const handleEnPassantMove = () => {
        const capturedPawnSquare: Square = { rank: from.rank, file: to.file };
        const capturedPiece = board.currentPieces[capturedPawnSquare.rank][capturedPawnSquare.file] as Piece;
        const enPassantMove: EnPassantMove = {
            type: 'enPassant',
            from,
            to,
            piece,
            capturedPiece,
        };
        movePiece(enPassantMove);
    }
    const handlePromotionMove = () => {
        // For now, auto-promote to Queen. A UI to select the piece would be needed for a full implementation.
        const promotionMove: PromotionMove = {
            type: 'promotion',
            from,
            to,
            piece,
            promotionTo: queen(piece.color, to),// Simplified promotion to queen
            capturedPiece: board.currentPieces[to.rank][to.file] || undefined,
        };
        movePiece(promotionMove);
    }
    const handleRegularMove = () => {
        const regularMove: RegularMove = {
            type: 'regular',
            from,
            to,
            piece,
            capturedPiece: board.currentPieces[to.rank][to.file] || undefined,
        };
        movePiece(regularMove);
    }
    const handleMove = {
        'castling': handleCastlingMove,
        'enPassant': handleEnPassantMove,
        'promotion': handlePromotionMove,
        'regular': handleRegularMove,
    }
    handleMove[moveType]();
};