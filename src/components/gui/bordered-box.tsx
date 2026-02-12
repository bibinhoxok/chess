import React, { CSSProperties } from "react"

const BACKGROUND_BORDERS_URL =
	"/pixel_chess_16x16_byBrysia/GUI/background-borders.png"

const BACKGROUND_COLOR = "#838b99"

interface LetterProps {
	char: string
	scale?:number
}

const borderMap: {
	[key: string]: [
		charX: number,
		charY: number,
		charWidth: number,
		charHeight: number,
	]
} = {
	"corner-top-left": [0, 0, 9, 9],
	"corner-top-right": [15, 0, 8, 8],
	"corner-bottom-left": [0, 15, 8, 8],
	"corner-bottom-right": [14, 14, 9, 9],
	top: [10, 0, 4, 6],
	bottom: [9, 17, 4, 6],
	left: [0, 10, 6, 4],
	right: [17, 9, 6, 4],
}

const Letter: React.FC<LetterProps> = ({ char, scale = 10 }: LetterProps) => {
	const charData = borderMap[char]

	if (!charData) {
		return null
	}

	const [charX, charY, charWidth, charHeight] = charData
	const backgroundPosition = `-${charX * scale}px -${charY * scale}px`
	const baseStyle: CSSProperties = {
		backgroundImage: `url(${BACKGROUND_BORDERS_URL})`,
		backgroundPosition,
		backgroundSize: `${23 * scale}px ${23 * scale}px`,
		width: `${charWidth * scale}px`,
		height: `${charHeight * scale}px`,
		imageRendering: "pixelated",
	}

	return (
		<div
			style={{
				...baseStyle,
			}}
		/>
	)
}

const BorderedBox: React.FC<{
	width: number
	height: number
	children: React.ReactNode
}> = ({ width, height, children }) => {
	const scale = 10
	const contentWidth = 4 * scale * width
	const contentHeight = 4 * scale * height

	return (
		<div
			className="flex items-center justify-center select-none"
			style={{
				backgroundImage: `linear-gradient(to right, ${BACKGROUND_COLOR}, ${BACKGROUND_COLOR})`,
				backgroundSize: `${contentWidth + 5 * scale}px ${contentHeight + 5 * scale}px`,
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
			}}
		>
			<div
				style={{
					display: "inline-grid",
					gridTemplateColumns: "auto auto auto",
					translate: `${scale / 2}px ${scale / 2}px`,
				}}
			>
				{/* Top row */}
				<Letter char="corner-top-left" />
				<div className="flex">
					{Array.from({ length: width }).map((_, i) => (
						<Letter key={i} char="top" />
					))}
				</div>
				<Letter char="corner-top-right" />

				{/* Middle row */}
				<div className="flex flex-col items-start">
					{Array.from({ length: height }).map((_, i) => (
						<Letter key={i} char="left" />
					))}
				</div>
				<div
					style={{
						width: contentWidth,
						height: contentHeight,
					}}
				>
					{children}
				</div>
				<div
					className="flex flex-col items-end"
					style={{ translate: `-${scale}px -${scale}px` }}
				>
					{Array.from({ length: height }).map((_, i) => (
						<Letter key={i} char="right" />
					))}
				</div>

				{/* Bottom row */}
				<Letter char="corner-bottom-left" />
				<div
					className="flex items-end"
					style={{ translate: `-${scale}px -${scale}px` }}
				>
					{Array.from({ length: width }).map((_, i) => (
						<Letter key={i} char="bottom" />
					))}
				</div>
				<div style={{ translate: `-${scale}px -${scale}px` }}>
					<Letter char="corner-bottom-right" />
				</div>
			</div>
		</div>
	)
}

export default BorderedBox
