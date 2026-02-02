export const BOARD_DIMENSIONS = {
	imageSize: 128,
	borderSize: 4,
	squareSize: 15,
} as const

export const calculateBoardScale = (scale: number) => {
	return {
		scaledBoardImageSize: BOARD_DIMENSIONS.imageSize * scale,
		scaledBorderSize: BOARD_DIMENSIONS.borderSize * scale,
		scaledSquareSize: BOARD_DIMENSIONS.squareSize * scale,
	}
}
