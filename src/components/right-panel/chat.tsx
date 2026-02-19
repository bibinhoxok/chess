import React, { useState } from "react"

const Chat = () => {
	const [input, setInput] = useState("")
	const [messages, setMessages] = useState<
		{ sender: string; text: string }[]
	>([
		{ sender: "System", text: "Game started!" },
		{ sender: "Opponent", text: "Good luck!" },
	])

	const handleSend = () => {
		if (input.trim()) {
			setMessages([...messages, { sender: "You", text: input }])
			setInput("")
		}
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-auto bg-gray-800 rounded-lg p-2 mb-4 space-y-2">
				{messages.map((msg, idx) => (
					<div key={idx} className="text-sm">
						<span className="font-bold text-gray-400">
							{msg.sender}:{" "}
						</span>
						<span className="text-gray-200">{msg.text}</span>
					</div>
				))}
			</div>
			<div className="flex gap-2">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
					placeholder="Type a message..."
					className="flex-1 bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					onClick={handleSend}
					className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
				>
					Send
				</button>
			</div>
		</div>
	)
}

export default Chat
