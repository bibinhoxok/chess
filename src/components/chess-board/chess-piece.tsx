import useChessboard from "@/lib/store/use-chess-board"
import { PieceName, Piece } from "@/lib/types/main"
import { motion } from "motion/react"
import { CSSProperties } from "react"

// The order of pieces in the sprite sheet
const pieceOrder: PieceName[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'pawn']
const spriteSheet = {
    white: '/pixel_chess_16x16_byBrysia/set_regular/pieces_white_1.png',
    black: '/pixel_chess_16x16_byBrysia/set_regular/pieces_black_1.png',
    hightlight: '/pixel_chess_16x16_byBrysia/set_regular/pieces_highlighted.png'
}

const offsetSpriteSheet = (pieceName: PieceName, spriteSheet: string) => {
    const index = pieceOrder.indexOf(pieceName)
    if (index === -1) return {}

    const xOffset = index * 15
    const yOffset = 0

    return {
        backgroundImage: `url(${spriteSheet})`,
        backgroundPosition: `-${xOffset}px -${yOffset}px`,
        width: '15px',
        height: '15px',
        imageRendering: 'pixelated' as CSSProperties['imageRendering'],
    }
}


type ChessPieceProps = {
    piece: Piece | null
    scaledSquareSize: number
    scale: number
    isSelected: boolean
    onDrop: (piece: Piece, event: MouseEvent | TouchEvent | PointerEvent) => void
}

const ChessPiece = ({ piece, scaledSquareSize, scale, isSelected, onDrop }: ChessPieceProps) =>{ 
    const { selectPiece } = useChessboard()
    return(
    <div
        className="relative flex items-center justify-center"
        style={{
            width: `${scaledSquareSize}px`,
            height: `${scaledSquareSize}px`,
        }}
    >
        {piece && (
                <motion.div 
                    drag
                    dragMomentum={false}
                    onClick={() => selectPiece(piece)}
                    onDragStart={()=>selectPiece(piece)}
                    onDragEnd={(event) => {
                        onDrop(piece, event as MouseEvent | TouchEvent | PointerEvent)
                    }}
                    initial={{ scale }}
                    transition={{ duration: 0.1 }}
                    dragSnapToOrigin
                    className="origin-center"
                    style={{
                        ...offsetSpriteSheet(piece.name, piece.color === "black" ? spriteSheet.black : spriteSheet.white),
                    }}
                >
                {isSelected && (
                    <div
                        className="origin-center absolute"
                        style={{
                            ...offsetSpriteSheet(piece.name, spriteSheet.hightlight),
                        }}
                    />
                )}
                </motion.div>
        )}
    </div>
)}

export default ChessPiece