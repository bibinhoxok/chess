import { PieceName, Piece } from "@/lib/types/main"
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
}

const ChessPiece = ({ piece, scaledSquareSize, scale, isSelected }: ChessPieceProps) => (
    <div
        className="relative flex items-center justify-center"
        style={{
            width: `${scaledSquareSize}px`,
            height: `${scaledSquareSize}px`,
        }}
    >
        {piece && (
            <>
                <div
                    className="origin-center"
                    style={{
                        ...offsetSpriteSheet(piece.name, piece.color === "black" ? spriteSheet.black : spriteSheet.white),
                        transform: `scale(${scale})`,
                    }}
                />
                {isSelected && (
                    <div
                        className="origin-center absolute"
                        style={{
                            ...offsetSpriteSheet(piece.name, spriteSheet.hightlight),
                            transform: `scale(${scale})`,
                        }}
                    />
                )}
            </>
        )}
    </div>
)

export default ChessPiece