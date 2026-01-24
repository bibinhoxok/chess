"use client"
import Chessboard from "@/components/chess-board/chess-board"
import React from "react"
import { useIsClient, useWindowSize } from "usehooks-ts"

const MainContent = () => {
	const { width = 0, height = 0 } = useWindowSize()
	const isClient = useIsClient()
	return (
		<div className="flex flex-col justify-center items-center flex-1">
			{isClient && (
				<Chessboard scale={Math.floor(height / (Math.sqrt(2) * 128))} />
			)}
		</div>
	)
}

export default MainContent
