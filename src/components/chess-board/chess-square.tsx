import { isPossibleMove } from "@/lib/controls/board/conditions"
import { ASSETS } from "@/lib/utils/assets"
import { ReactNode } from "react"

const ChessSquare = ({ children, scaledSquareSize, possibleMove }: { children?: ReactNode, scaledSquareSize: number, possibleMove: boolean }) => {
    return (
        <div
            className="relative flex items-center justify-center select-none"
            style={{
                width: `${scaledSquareSize}px`,
                height: `${scaledSquareSize}px`,
            }}
        >
            {children}
            {possibleMove && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <div
                        className="bg-contain bg-no-repeat pixelated"
                        style={{
                            backgroundImage: `url(${ASSETS.ui.circle})`,
                            width: `${scaledSquareSize}px`,
                            height: `${scaledSquareSize}px`,
                        }}
                    />
                </div>
            )}
        </div>
    )
}

export default ChessSquare