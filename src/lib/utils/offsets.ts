import { PieceName } from "@/lib/types/main"

// The order of pieces in the sprite sheet
export const pieceOrder: PieceName[] = [
	"rook",
	"knight",
	"bishop",
	"queen",
	"king",
	"pawn",
]

export const offsetSpriteSheet = (pieceName: PieceName, spriteSheet: string) => {
	const index = pieceOrder.indexOf(pieceName)
	if (index === -1) return {}

	const xOffset = index * 15
	const yOffset = 0

	return {
		backgroundImage: `url(${spriteSheet})`,
		backgroundPosition: `-${xOffset}px -${yOffset}px`,
	}
}
