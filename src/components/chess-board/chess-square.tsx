import { ASSETS } from "@/lib/utils/assets"
import { cn } from "@/lib/utils/cn"
import { ComponentProps, ReactNode } from "react"
interface ChessSquareProps extends ComponentProps<"div"> {
    scaledSquareSize: number
    possibleMove: boolean
    children?: ReactNode
}

const ChessSquare = ({
    children,
    scaledSquareSize,
    possibleMove,
    className,
    style,
    ...props
}: ChessSquareProps) => {
    return (
        <div
            className={cn("relative flex items-center justify-center select-none", className)}
            style={{
                width: `${scaledSquareSize}px`,
                height: `${scaledSquareSize}px`,
                ...style,
            }}
            {...props}
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