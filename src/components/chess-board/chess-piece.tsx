import useChessboard from "@/lib/store/use-chess-board"
import { PieceName, Piece, Square } from "@/lib/types/main"
import { motion } from "motion/react"

// The order of pieces in the sprite sheet
const pieceOrder: PieceName[] = [
	"rook",
	"knight",
	"bishop",
	"queen",
	"king",
	"pawn",
]
const spriteSheet = {
	white: "/pixel_chess_16x16_byBrysia/set_regular/pieces_white_1.png",
	black: "/pixel_chess_16x16_byBrysia/set_regular/pieces_black_1.png",
	hightlight:
		"/pixel_chess_16x16_byBrysia/set_regular/pieces_highlighted.png",
}

const offsetSpriteSheet = (pieceName: PieceName, spriteSheet: string) => {
	const index = pieceOrder.indexOf(pieceName)
	if (index === -1) return {}

	const xOffset = index * 15
	const yOffset = 0

	return {
		backgroundImage: `url(${spriteSheet})`,
		backgroundPosition: `-${xOffset}px -${yOffset}px`,
	}
}

type ChessPieceProps = {
	piece: Piece | null
	currentSquare: Square
	scaledSquareSize: number
	scale: number
	isSelected: boolean
	onDrop: (
		event: MouseEvent | TouchEvent | PointerEvent,
	) => void
	isCheckedSource?: boolean
	isDraggable?: boolean
	isClickable?: boolean
}

const ChessPiece = ({
	piece,
	currentSquare,
	scaledSquareSize,
	scale,
	isSelected,
	isCheckedSource = false,
	onDrop,
	isDraggable = true,
	isClickable = true,
}: ChessPieceProps) => {
	const { selectPiece } = useChessboard()

	const handleClick = () => {
		if (isClickable && piece) selectPiece(currentSquare, piece)
	}
	return (
		<div
			className="relative flex items-center justify-center"
			style={{
				width: `${scaledSquareSize}px`,
				height: `${scaledSquareSize}px`,
			}}
		>
			{piece && (
				<motion.div
					drag={isDraggable}
					dragMomentum={false}
					onClick={handleClick}
					onDragStart={handleClick}
					onDragEnd={(event) => {
						onDrop(
							event as MouseEvent | TouchEvent | PointerEvent,
						)
					}}
					initial={{ scale }}
					transition={{ duration: 0.1 }}
					dragSnapToOrigin
					className="origin-center pixelated chess-sprite"
					style={{
						...offsetSpriteSheet(
							piece.name,
							piece.color === "black"
								? spriteSheet.black
								: spriteSheet.white,
						),
					}}
				>
					{isSelected && (
						<div
							className="origin-center absolute pixelated chess-sprite"
							style={{
								...offsetSpriteSheet(
									piece.name,
									spriteSheet.hightlight,
								),
							}}
						/>
					)}
					{isCheckedSource && (
						<div
							className="origin-center absolute pixelated filter-yellow chess-sprite"
							style={{
								...offsetSpriteSheet(
									piece.name,
									spriteSheet.hightlight,
								),
							}}
						/>
					)}
				</motion.div>
			)}
		</div>
	)
}

export default ChessPiece
