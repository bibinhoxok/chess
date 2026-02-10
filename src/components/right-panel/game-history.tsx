import React from "react"

const GameHistory = () => {
    const dummyMoves = [
        { white: "e4", black: "e5" },
        { white: "Nf3", black: "Nc6" },
        { white: "Bb5", black: "a6" },
        { white: "Ba4", black: "Nf6" },
    ]

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-auto bg-gray-800 rounded-lg p-2 mb-4">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-2 px-2">#</th>
                            <th className="py-2 px-2">White</th>
                            <th className="py-2 px-2">Black</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyMoves.map((move, index) => (
                            <tr key={index} className="even:bg-gray-700/50 hover:bg-gray-700 transition-colors">
                                <td className="py-1 px-2 text-gray-500">{index + 1}.</td>
                                <td className="py-1 px-2 font-medium text-white">{move.white}</td>
                                <td className="py-1 px-2 font-medium text-white">{move.black}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
                    <span>🔍</span> Analyze
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded transition-colors" title="Download PGN">
                    📥
                </button>
            </div>
        </div>
    )
}

export default GameHistory
