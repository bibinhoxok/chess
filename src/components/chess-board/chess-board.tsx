"use client"
import useChessboard from "@/lib/store/use-chess-board"
import ChessPiece from "./chess-piece"
import { Board, Square } from "@/lib/types/main"
import { useRef } from "react"
import { handlePieceMove } from "@/lib/handlers/piece-moves"
import { areSameSquare, isChecked, isCheckedKing, isPieceCanMove, isPossibleMove, isThreatingKing } from "@/lib/controls/board/conditions"
import { AnimatePresence, motion } from "motion/react"
import PromotionSelection from "./promotion-selection"
import { Z_INDEX } from "@/lib/utils/z-index"
import { calculateBoardScale } from "@/lib/utils/scaling"
import { ASSETS } from "@/lib/utils/assets"

const Chessboard = ({ scale }: { scale: number }) => {
	const {
		currentPieces,
		selectPiece,
		selectedPiece,
		possibleMoves,
		movePiece,
		currentPlayer,
		gameHistory,
		gameStatus,
		selectedSquare,
		setPromotionSquare,
		promotionSquare,
	} = useChessboard()

	const board: Board = {
		selectedPiece,
		selectedSquare,
		possibleMoves,
		currentPieces,
		currentPlayer,
		gameHistory,
		gameStatus,
	}

	const boardRef = useRef<HTMLDivElement>(null)

	// Board scale
	const boardScale = calculateBoardScale(scale)

	const isCurrentChecked = isChecked(board)


	const handleDrop = (
		event: MouseEvent | TouchEvent | PointerEvent,
	) => {
		if (!boardRef.current) return
		const boardRect = boardRef.current.getBoundingClientRect()

		let clientX, clientY
		if ("changedTouches" in event) {
			// TouchEvent
			clientX = event.changedTouches[0].clientX
			clientY = event.changedTouches[0].clientY
		} else {
			// MouseEvent or PointerEvent
			clientX = event.clientX
			clientY = event.clientY
		}

		let x = clientX - boardRect.left
		let y = clientY - boardRect.top

		if (currentPlayer === "white") {
			x = boardRect.width - x
			y = boardRect.height - y
		}

		const col = Math.floor((x - boardScale.scaledBorderSize) / boardScale.scaledSquareSize)
		const row = Math.floor((y - boardScale.scaledBorderSize) / boardScale.scaledSquareSize)
		const to = { row, col }
		if (selectedPiece && selectedSquare && isPossibleMove({ row, col }, board)) {
			handlePieceMove(
				board,
				selectedSquare,
				to,
				movePiece,
				setPromotionSquare,
			)
		}
	}

	const handleSquareClick = (square: Square) => {
		const piece = currentPieces[square.row][square.col]
		if (piece && piece.color === currentPlayer) {
			selectPiece(square, piece)
		}
	}

	return (
		<>
			{promotionSquare && <PromotionSelection />}
			<AnimatePresence>
				<motion.div
					animate={{ rotate: currentPlayer === "white" ? 180 : 0 }}
					transition={{
						duration: 0.5,
					}}
					ref={boardRef}
					className="relative bg-[length:100%_100%] [image-rendering:pixelated]"
					style={{
						backgroundImage: `url(${ASSETS.boards.purple})`,
						width: `${boardScale.scaledBoardImageSize}px`,
						height: `${boardScale.scaledBoardImageSize}px`,
					}}
				>
					<div
						className="absolute grid grid-cols-[repeat(8,var(--square-size))] grid-rows-[repeat(8,var(--square-size))]"
						style={{
							top: `${boardScale.scaledBorderSize}px`,
							left: `${boardScale.scaledBorderSize}px`,
							//@ts-ignore
							"--square-size": `${boardScale.scaledSquareSize}px`,
						}}
					>
						{currentPieces.flat().map((piece, index) => {
							const square: Square = { row: Math.floor(index / 8), col: index % 8 }
							return (
								<motion.div
									onClick={() => handleSquareClick(square)}
									animate={{ rotate: currentPlayer === "white" ? 180 : 0 }}
									style={{
										zIndex: areSameSquare(selectedSquare, square)
											? Z_INDEX.selectedSquare
											: Z_INDEX.default,
									}}
									transition={{ duration: 0.5 }}
									key={index}
									className="relative"
								>
									<ChessPiece
										piece={piece}
										currentSquare={square}
										scaledSquareSize={
											boardScale.scaledSquareSize
										}
										scale={scale}
										isSelected={areSameSquare(selectedSquare, square)}
										isDraggable={isPieceCanMove(board, square)}
										isCheckedSource={isCurrentChecked && (isCheckedKing(square, board) || isThreatingKing(square, board))}
										onDrop={handleDrop}
									/>
									{isPossibleMove(square, board) && selectedPiece && (
										<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
											<div
												className="bg-contain bg-no-repeat pixelated"
												style={{
													backgroundImage: `url(${ASSETS.ui.circle})`,
													width: `${boardScale.scaledSquareSize}px`,
													height: `${boardScale.scaledSquareSize}px`,
												}}
											/>
										</div>
									)}
								</motion.div>
							)
						})}
					</div>
				</motion.div>
			</AnimatePresence>
			<p className="text-white text-2xl">{currentPlayer} move.</p>
		</>
	)
}
export default Chessboard
