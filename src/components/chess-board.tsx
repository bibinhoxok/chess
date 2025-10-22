import useChessboard from "@/lib/store/useChessboard"
import ChessPiece from "./chess-piece"
import { Piece, Square } from "@/lib/types/main"
import { useRef } from "react"


// Board scale
const boardSize = {
	scale: 3,
	boardImageSize: 128,
	borderSize: 4,
	squareSize: 15,
}

const boardScale = {
	scaledBoardImageSize: boardSize.boardImageSize * boardSize.scale,
	scaledBorderSize: boardSize.borderSize * boardSize.scale,
	scaledSquareSize: boardSize.squareSize * boardSize.scale,
}

const Chessboard = () => {
	const { currentPieces, selectPiece, selectedPiece, possibleMoves, movePiece, currentPlayer, gameHistory, gameStatus } = useChessboard()
	const boardRef = useRef<HTMLDivElement>(null)

	const isPossibleMove = (square: Square) => possibleMoves.some(move => move.rank === square.rank && move.file === square.file)


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

		const x = clientX - boardRect.left
		const y = clientY - boardRect.top

		const file = Math.floor((x - boardScale.scaledBorderSize) / boardScale.scaledSquareSize)
		const rank = Math.floor((y - boardScale.scaledBorderSize) / boardScale.scaledSquareSize)
		if (isPossibleMove({ rank, file })) {
			movePiece(piece.currentSquare, { rank, file })
		}
	}

	return (
		<>
			<div
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
							rank: Math.floor(index / 8),
							file: index % 8
						}
						return (
							<div key={index} className="relative">
								<ChessPiece
									piece={piece}
									scaledSquareSize={boardScale.scaledSquareSize}
									scale={boardSize.scale}
									isSelected={selectedPiece?.currentSquare.rank === square.rank && selectedPiece?.currentSquare.file === square.file}
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
							</div>
						)
					})}
				</div>
			</div>
			
			<p className='text-white text-2xl'>{currentPlayer} move.</p>
		</>
	)
}
export default Chessboard