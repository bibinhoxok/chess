"use client"

import React from "react"
import { Tabs } from "@/components/gui/tabs"
import PlayerInfo from "@/components/right-panel/player-info"
import GameHistory from "@/components/right-panel/game-history"
import Chat from "@/components/right-panel/chat"
import Tools from "@/components/right-panel/tools"

const RightWrapper = () => {
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
		<div className="flex-1 p-4 bg-gray-900 border-l border-gray-700 text-white flex flex-col h-screen max-w-sm">
			<Tabs tabs={tabs} defaultTab="history" className="h-full" />
		</div>
	)
}

export default RightWrapper