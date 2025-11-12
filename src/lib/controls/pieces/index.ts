import { pawn } from './pawn';
import { rook } from './rook';
import { knight } from './knight';
import { bishop } from './bishop';
import { queen } from './queen';
import { king } from './king';
import { PieceName, Piece, Color } from '@/lib/types/main';

type PieceFactory = (color: Color) => Piece;

export const pieces: Record<PieceName, PieceFactory> = {
    pawn,
    rook,
    knight,
    bishop,
    queen,
    king
};