"use client"
import useChessboard from "@/lib/store/use-chess-board"
import ChessPiece from "./chess-piece"
import { Board, Square } from "@/lib/types/main"
import { useMemo, useRef } from "react"
import { handlePieceMove } from "@/lib/handlers/piece-moves"
import { areSameSquare, isChecked, isCheckedMate, isPieceCanMove, isPossibleMove, isThreatingKing } from "@/lib/controls/board/conditions"
import { getPossibleMoves } from "@/lib/controls/board/moves"
import { AnimatePresence, motion } from "motion/react"
import PromotionSelection from "./promotion-selection"
import { Z_INDEX } from "@/lib/utils/z-index"
import { calculateBoardScale } from "@/lib/utils/scaling"
import { ASSETS } from "@/lib/utils/assets"
import ChessSquare from "./chess-square"
import { getPieceAt, getSquareFromPieceType, getThreatingPieces } from "@/lib/controls/board/utils"

const Chessboard = ({ scale }: { scale: number }) => {
	const {
		currentPieces,
		selectPiece,
		selectedPiece,
		possibleMoves,
		currentPlayer,
		gameHistory,
		gameStatus,
		selectedSquare,
		promotionSquare,
		capturedPiece,
	} = useChessboard()

	const board: Board = {
		selectedPiece,
		selectedSquare,
		possibleMoves,
		currentPieces,
		currentPlayer,
		gameHistory,
		gameStatus,
		capturedPiece
	}

	const boardRef = useRef<HTMLDivElement>(null)

	// Board scale
	const boardScale = useMemo(() => calculateBoardScale(scale), [scale])

	const isCurrentChecked = useMemo(() => isChecked(board), [currentPieces, currentPlayer])
	const isCurrentCheckedmate = useMemo(() => isCheckedMate(board), [currentPieces, currentPlayer, gameHistory])

	const threateningSquares = useMemo(() => {
		const kingSquare = getSquareFromPieceType(board, ["king"], currentPlayer).at(0)
		return isCurrentChecked && kingSquare
			? getThreatingPieces(board, kingSquare)
			: []
	}, [currentPieces, currentPlayer, isCurrentChecked])

	const validMovesIndices = useMemo(() => {
		if (!selectedPiece || !selectedSquare) return new Set<number>()
		const moves = getPossibleMoves(selectedSquare, board)
		return new Set(moves.map(m => m.row * 8 + m.col))
	}, [selectedPiece, selectedSquare, currentPieces, currentPlayer])

	const movablePieceIndices = useMemo(() => {
		const indices = new Set<number>()
		currentPieces.flat().forEach((piece, index) => {
			if (piece && piece.color === currentPlayer) {
				const square = { row: Math.floor(index / 8), col: index % 8 }
				if (isPieceCanMove(board, square)) {
					indices.add(index)
				}
			}
		})
		return indices
	}, [currentPieces, currentPlayer])

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
		const state = useChessboard.getState()
		if (state.selectedPiece && state.selectedSquare && isPossibleMove(square, state)) {
			handlePieceMove(
				state,
				state.selectedSquare,
				square,
				state.movePiece,
				state.setPromotionSquare,
			)
			return
		}

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
							const possibleMove = validMovesIndices.has(index)
							if (!piece) return <ChessSquare scaledSquareSize={boardScale.scaledSquareSize} possibleMove={possibleMove} key={index} />
							const isKingChecked = piece.name === "king" && piece.color === currentPlayer && isCurrentChecked
							const isCheckedSource = isCurrentChecked && (isKingChecked || threateningSquares.some(v => areSameSquare(v, square)))
							const isCheckedmateSource = isCurrentCheckedmate && (isKingChecked || threateningSquares.some(v => areSameSquare(v, square)))
							const isClickable = piece.color === currentPlayer && movablePieceIndices.has(index)
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
