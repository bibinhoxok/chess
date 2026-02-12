"use client"

import React from "react"
import { Tabs } from "@/components/gui/tabs"
import PlayerInfo from "@/components/right-panel/player-info"
import GameHistory from "@/components/right-panel/game-history"
import Chat from "@/components/right-panel/chat"
import Tools from "@/components/right-panel/tools"
import { useIsClient } from "usehooks-ts"

const RightWrapper = () => {
	const isClient = useIsClient()

	const tabs = [
		{
			id: "player",
			label: "Player",
			content: <PlayerInfo />,
		},
		{
			id: "history",
			label: "History",
			content: <GameHistory />,
		},
		{
			id: "chat",
			label: "Chat",
			content: <Chat />,
		},
		{
			id: "tools",
			label: "Tools",
			content: <Tools />,
		},
	]

	return (
		<div className="p-4 text-white min-w-96">
			{isClient && <Tabs tabs={tabs} defaultTab="history" />}
		</div>
	)
}

export default RightWrapper