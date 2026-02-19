import type { PieceName } from "@/lib/types/main"

export const pieceDic = {
	K: "king" as PieceName,
	Q: "queen" as PieceName,
	R: "rook" as PieceName,
	B: "bishop" as PieceName,
	N: "knight" as PieceName,
	"": "pawn" as PieceName,
} as const

export const fileDic = {
	a: 0,
	b: 1,
	c: 2,
	d: 3,
	e: 4,
	f: 5,
	g: 6,
	h: 7,
} as const
