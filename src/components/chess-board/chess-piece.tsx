import { Piece } from "@/lib/types/main"
import { motion } from "motion/react"
import { Z_INDEX } from "@/lib/utils/z-index"
import { offsetSpriteSheet } from "@/lib/utils/offsets"
import { ASSETS } from "@/lib/utils/assets"

export type ChessPieceProps = {
	piece: Piece
	scale: number
	isSelected?: boolean
	isClickable?: boolean
	isChecked?: boolean
	isCheckmate?: boolean
	rotate?: number
	onDrop?: (event: MouseEvent | TouchEvent | PointerEvent) => void
	onClick?: () => void
}

export const ChessPiece = ({
	piece,
	scale,
	isSelected = false,
	isClickable = false,
	isChecked = false,
	isCheckmate = false,
	rotate = 0,
	onDrop,
	onClick,
}: ChessPieceProps) => {
	const handleClick = () => {
		if (isClickable && onClick) onClick()
	}

	return (
		<motion.div
			className="relative"
			animate={{ rotate }}
			transition={{ duration: 0.5 }}
			style={{
				zIndex: isSelected ? Z_INDEX.selectedSquare : Z_INDEX.default,
			}}
		>
			<motion.div
				drag={isClickable}
				dragMomentum={false}
				dragSnapToOrigin
				onClick={handleClick}
				onDragStart={handleClick}
				onDragEnd={(event) => {
					if (onDrop) {
						onDrop(
							event as MouseEvent | TouchEvent | PointerEvent,
						)
					}
				}}
				initial={{ scale }}
				animate={{ scale }}
				transition={{ duration: 0.1 }}
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
				{isChecked && !isCheckmate && (
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
				{isCheckmate && (
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
		</motion.div>
	)
}
