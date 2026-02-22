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


