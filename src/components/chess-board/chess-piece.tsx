import useChessboard from "@/lib/store/use-chess-board"
import { PieceName, Piece, Square } from "@/lib/types/main"
import { motion } from "motion/react"
import { Z_INDEX } from "@/lib/utils/z-index"
import { offsetSpriteSheet } from "@/lib/utils/offsets"
import { ASSETS } from "@/lib/utils/assets"

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
						zIndex: isSelected ? Z_INDEX.selectedPiece : Z_INDEX.piece,
						...offsetSpriteSheet(
							piece.name,
							piece.color === "black"
								? ASSETS.sprites.black
								: ASSETS.sprites.white,
						),
					}}
				>
					{isSelected && (
						<div
							className="origin-center absolute pixelated chess-sprite"
							style={{
								...offsetSpriteSheet(
									piece.name,
									ASSETS.sprites.highlight,
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
									ASSETS.sprites.highlight,
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
