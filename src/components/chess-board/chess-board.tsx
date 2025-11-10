import useChessboard from "@/lib/store/use-chess-board"
import ChessPiece from "./chess-piece"
import { Board, Piece, Square } from "@/lib/types/main"
import { useRef } from "react"
import { handlePieceMove } from "@/lib/handlers/piece-moves"
import { isValidMove } from "@/lib/controls/board/conditions"
import { AnimatePresence, motion } from "motion/react"
import { getPossibleMoves } from "@/lib/controls/pieces/possible-moves"



const Chessboard = ({ scale }: { scale: number }) => {
	const { currentPieces, selectPiece, selectedPiece, possibleMoves, movePiece, currentPlayer, gameHistory, gameStatus } = useChessboard()
	
	const board: Board = {
		selectedPiece,
		possibleMoves,
		currentPieces,
		currentPlayer,
		gameHistory,
		gameStatus,
	}

	const boardRef = useRef<HTMLDivElement>(null)

	// Board scale
	const boardSize = {
		scale,
		boardImageSize: 128,
		borderSize: 4,
		squareSize: 15,
	}

	const boardScale = {
		scaledBoardImageSize: boardSize.boardImageSize * boardSize.scale,
		scaledBorderSize: boardSize.borderSize * boardSize.scale,
		scaledSquareSize: boardSize.squareSize * boardSize.scale,
	}

	const isPossibleMove = (square: Square) => selectedPiece && selectedPiece.color === currentPlayer && isValidMove(selectedPiece, board, square)

	const handleDrop = (piece: Piece, event: MouseEvent | TouchEvent | PointerEvent) => {
		if (!boardRef.current) return
		const boardRect = boardRef.current.getBoundingClientRect()

		let clientX, clientY;
		if ('changedTouches' in event) {
			// TouchEvent
			clientX = event.changedTouches[0].clientX;
			clientY = event.changedTouches[0].clientY;
		} else {
			// MouseEvent or PointerEvent
			clientX = event.clientX;
			clientY = event.clientY;
		}

		let x = clientX - boardRect.left
		let y = clientY - boardRect.top

		if (currentPlayer === 'white') {
			x = boardRect.width - x
			y = boardRect.height - y
		}

		const col = Math.floor((x - boardScale.scaledBorderSize) / boardScale.scaledSquareSize)
		const row = Math.floor((y - boardScale.scaledBorderSize) / boardScale.scaledSquareSize)
		const to = { row, col };
		if (selectedPiece && isPossibleMove({ row, col })) {
			handlePieceMove(board, piece, to, movePiece);
		}
	}

	return (
		<>
			<AnimatePresence>
				<motion.div
					animate={{ rotate: currentPlayer === 'white' ? 180 : 0 }}
					transition={{
						duration: 0.5,
					}}
					ref={boardRef}
					className="relative bg-[url('/pixel_chess_16x16_byBrysia/boards_additional_colors/board_purple.png')] bg-[length:100%_100%] [image-rendering:pixelated]"
					style={{
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
							'--square-size': `${boardScale.scaledSquareSize}px`,
						}}
					>
						{currentPieces.flat().map((piece, index) => {
							const square: Square = {
								row: Math.floor(index / 8),
								col: index % 8
							}
							return (
								<motion.div
									animate={{ rotate: currentPlayer === 'white' ? 180 : 0 }}
									transition={{
										duration: 0.5,
									}}
									key={index} className="relative">
									<ChessPiece
										piece={piece}
										scaledSquareSize={boardScale.scaledSquareSize}
										scale={boardSize.scale}
										isSelected={selectedPiece?.currentSquare.row === square.row && selectedPiece?.currentSquare.col === square.col}
										onDrop={handleDrop}
									/>
									{isPossibleMove(square) && selectedPiece && (
										<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
											<div
												className="bg-[url('/pixel_chess_16x16_byBrysia/set_regular/circle.png')] bg-contain bg-no-repeat"
												style={{
													width: `${boardScale.scaledSquareSize}px`,
													height: `${boardScale.scaledSquareSize}px`,
													imageRendering: 'pixelated'
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
			<p className='text-white text-2xl'>{currentPlayer} move.</p>
		</>
	)
}
export default Chessboard