import { Piece, Square } from "@/lib/types/main"
import { motion } from "motion/react"
import { Z_INDEX } from "@/lib/utils/z-index"
import { offsetSpriteSheet } from "@/lib/utils/offsets"
import { ASSETS } from "@/lib/utils/assets"

type ChessPieceProps = {
	piece: Piece
	currentSquare: Square
	scale: number
	isSelected: boolean
	onDrop: (
		event: MouseEvent | TouchEvent | PointerEvent,
	) => void
	onClick: () => void
	isCheckedSource?: boolean
	isCheckedmateSource?: boolean
	isClickable?: boolean
}

const ChessPiece = ({
	piece,
	scale,
	isSelected,
	isCheckedSource = false,
	isCheckedmateSource = false,
	onDrop,
	onClick,
	isClickable = true,
}: ChessPieceProps) => {
	const handleClick = () => {
		if (isClickable) onClick()
	}

	return (
		<motion.div
			drag={isClickable}
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
			{isCheckedSource && !isCheckedmateSource && (
				<div
					className="origin-center absolute pixelated chess-sprite"
					style={{
						...offsetSpriteSheet(
							piece.name,
							ASSETS.sprites.checked,
						),
					}}
				/>
			)}
			{isCheckedmateSource && (
				<div
					className="origin-center absolute pixelated chess-sprite"
					style={{
						...offsetSpriteSheet(
							piece.name,
							ASSETS.sprites.mate,
						),
					}}
				/>
			)}
		</motion.div>

	)
}

export default ChessPiece
