import useChessboard from "@/lib/store/use-chess-board"
import { PieceName } from "@/lib/types/main"
import BorderedBox from "../gui/bordered-box"
import { pieces } from "@/lib/controls/pieces"
import { ChessPiece } from "./chess-piece"
import { motion } from "motion/react"
import { Z_INDEX } from "@/lib/utils/z-index"

const promotionPieces: PieceName[] = ["queen", "rook", "bishop", "knight"]

const PromotionSelection = () => {
	const { handlePromotion, currentPlayer, setPromotionSquare } =
		useChessboard()

	return (
		<div
			className="absolute inset-0 bg-black/50 flex justify-center items-center"
			style={{ zIndex: Z_INDEX.promotionSelection }}
			onClick={() => setPromotionSquare(null)}
		>
			<div onClick={(e) => e.stopPropagation()}>
				<BorderedBox width={6} height={1}>
					<div className="flex">
						{promotionPieces.map((pieceName) => (
							<div
								key={pieceName}
								className="w-1/4 h-full flex items-center justify-center cursor-pointer"
								onClick={() => handlePromotion(pieceName)}
							>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<ChessPiece
										piece={pieces[pieceName](currentPlayer)}
										scale={4}
										isSelected={false}
										isClickable={false}
									/>
								</motion.div>
							</div>
						))}
					</div>
				</BorderedBox>
			</div>
		</div>
	)
}

export default PromotionSelection
