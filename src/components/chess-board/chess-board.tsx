"use client"
import useChessboard from "@/lib/store/use-chess-board"
import { ChessPiece, ChessPieceProps } from "./chess-piece"
import { Board, Piece, Square } from "@/lib/types/main"
import { useEffect, useMemo, useRef } from "react"
import { handlePieceMove } from "@/lib/handlers/piece-moves"
import { areSameSquare, checkGameStatus, isChecked, isCheckedMate, isPieceCanMove, isPossibleMove } from "@/lib/controls/board/conditions"
import { getPossibleMoves, redoMove, undoMove } from "@/lib/controls/board/moves"
import { AnimatePresence, motion } from "motion/react"
import PromotionSelection from "./promotion-selection"
import { calculateBoardScale } from "@/lib/utils/scaling"
import { ASSETS } from "@/lib/utils/assets"
import ChessSquare from "./chess-square"
import { getPieceAt, getSquareFromPieceType, getThreatingPieces } from "@/lib/controls/board/utils"

const pseudoPiece: Piece = { color: "white", name: "king", value: 0 }

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
		capturedPieces,
		currentHistoryIndex,
		undo,
		redo,
		restart,
	} = useChessboard()

	const board: Board = {
		selectedPiece,
		selectedSquare,
		possibleMoves,
		currentPieces,
		currentPlayer,
		gameHistory,
		gameStatus,
		capturedPieces,
		currentHistoryIndex,
	}

	useEffect(() => {
		console.log(gameHistory.at(currentHistoryIndex)?.move)
	}, [gameHistory])

	const boardRef = useRef<HTMLDivElement>(null)
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

	const lastMoveIndices = useMemo(() => {
		const lastHistory = gameHistory.at(-1)
		if (!lastHistory) return new Set<number>()
		const lastMove = lastHistory.move
		const squares = lastMove.type === "castling"
			? [lastMove.kingMove.from, lastMove.kingMove.to, lastMove.rookMove.from, lastMove.rookMove.to]
			: [lastMove.from, lastMove.to]
		return new Set(squares.map(s => s.row * 8 + s.col))
	}, [gameHistory])

	const lastMoveBackground = useMemo(() => ({
		backgroundImage: `url(${ASSETS.sprites.lastMoves})`,
		width: `${boardScale.scaledSquareSize}px`,
		height: `${boardScale.scaledSquareSize}px`,
	}), [boardScale])

	const handleMove = (targetSquare: Square) => {
		const state = useChessboard.getState()
		if (state.selectedPiece && state.selectedSquare && isPossibleMove(targetSquare, state)) {
			handlePieceMove(
				state,
				state.selectedSquare,
				targetSquare,
				state.movePiece,
				state.setPromotionSquare,
			)
			return true
		}
		return false
	}

	const handleUndo = () => {
		if (!gameHistory.length) return
		console.log("undo")
		undo()
	}

	const handleRedo = () => {
		console.log("redo")
		redo()
	}

	const handleRestart = () => {
		console.log("restart")
		restart()
	}

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

		handleMove(to)
	}

	const handleSquareClick = (square: Square) => {
		if (handleMove(square)) return

		const piece = getPieceAt(square, board)
		if (piece && piece.color === currentPlayer) {
			selectPiece(square, piece)
		}
	}

	const handleMoveClick = (square: Square) => {
		handleMove(square)
	}

	return (
		<div className="flex flex-col items-center">
			<div className="relative w-fit">
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
								const chessPieceProps: ChessPieceProps = {
									rotate: currentPlayer === "white" ? 180 : 0,
									piece: pseudoPiece,
									scale,
									onDrop: handleDrop,
									onClick: () => handleSquareClick(square),
								}
								if (piece) {
									chessPieceProps.piece = piece
									chessPieceProps.isClickable = movablePieceIndices.has(index)
									if (chessPieceProps.isClickable && selectedSquare) {
										chessPieceProps.isSelected = areSameSquare(selectedSquare, square)
									}
									if (isCurrentChecked) {
										const isKingChecked = piece.name === "king" && piece.color === currentPlayer
										const isThreatening = threateningSquares.some(v => areSameSquare(v, square))
										if (isKingChecked || isThreatening) {
											chessPieceProps.isChecked = true
											chessPieceProps.isCheckmate = isCurrentCheckedmate
										}
									}
								}
								return (
									<ChessSquare
										className="bg-contain bg-no-repeat pixelated"
										style={lastMoveIndices.has(index) ? lastMoveBackground : undefined}
										scaledSquareSize={boardScale.scaledSquareSize}
										possibleMove={possibleMove}
										key={index}
										onClick={possibleMove ? () => handleMoveClick(square) : undefined}
									>
										{piece && <ChessPiece {...chessPieceProps} />}
									</ChessSquare>
								)
							})}
						</div>
					</motion.div>
				</AnimatePresence>
				{promotionSquare && <PromotionSelection />}
			</div>
			<p className="text-white text-2xl mt-4">{currentPlayer} move.</p>
			<p className="text-white text-2xl mt-4">{gameStatus}</p>
			<button onClick={handleUndo}>Undo</button>
			<button onClick={handleRedo}>Redo</button>
			<button onClick={handleRestart}>Restart</button>
		</div>
	)
}
export default Chessboard
