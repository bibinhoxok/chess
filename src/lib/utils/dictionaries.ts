import type { PieceName } from "@/lib/types/main"

export const pieceDic: Record<string, PieceName> = {
	K: "king",
	Q: "queen",
	R: "rook",
	B: "bishop",
	N: "knight",
	"": "pawn",
} as const

export const sanPieceDic: Record<PieceName, string> = {
	king: "K",
	queen: "Q",
	rook: "R",
	bishop: "B",
	knight: "N",
	pawn: "",
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
