"use client"
import useChessboard from "@/lib/store/use-chess-board"
import ChessPiece from "./chess-piece"
import { Board, Square } from "@/lib/types/main"
import { useRef } from "react"
import { handlePieceMove } from "@/lib/handlers/piece-moves"
import { areSameSquare, isChecked, isCheckedMate, isPieceCanMove, isPossibleMove, isThreatingKing } from "@/lib/controls/board/conditions"
import { AnimatePresence, motion } from "motion/react"
import PromotionSelection from "./promotion-selection"
import { Z_INDEX } from "@/lib/utils/z-index"
import { calculateBoardScale } from "@/lib/utils/scaling"
import { ASSETS } from "@/lib/utils/assets"
import ChessSquare from "./chess-square"
import { getPieceAt } from "@/lib/controls/board/utils"

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
	const isCurrentCheckedmate = isCheckedMate(board)


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

		const state = useChessboard.getState()

		if (state.selectedPiece && state.selectedSquare && isPossibleMove({ row, col }, state)) {
			handlePieceMove(
				state,
				state.selectedSquare,
				to,
				state.movePiece,
				state.setPromotionSquare,
			)
		}
	}

	const handleSquareClick = (square: Square) => {
		const piece = getPieceAt(square, board)
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
							const possibleMove = selectedPiece ? isPossibleMove(square, board) as boolean : false
							if (!piece) return <ChessSquare scaledSquareSize={boardScale.scaledSquareSize} possibleMove={possibleMove} key={index} />
							const isKingChecked = piece.color === currentPlayer && piece.name === "king" && isCurrentChecked
							const isCheckedSource = isCurrentChecked && (isKingChecked || isThreatingKing(square, board))
							const isCheckedmateSource = isCurrentCheckedmate && (isKingChecked || isThreatingKing(square, board))
							const isClickable = piece.color === currentPlayer && isPieceCanMove(board, square)
							return (
								<ChessSquare
									scaledSquareSize={boardScale.scaledSquareSize}
									possibleMove={possibleMove}
									key={index}
								>
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
											scale={scale}
											isSelected={isPieceCanMove(board, square) && areSameSquare(selectedSquare, square)}
											isCheckedSource={isCheckedSource}
											isCheckedmateSource={isCheckedmateSource}
											onDrop={handleDrop}
											onClick={() => handleSquareClick(square)}
											isClickable={isClickable}
										/>

									</motion.div>
								</ChessSquare>
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
