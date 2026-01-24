import React from "react"

interface AlertProps {
	message: string
	type: "info" | "success" | "warning" | "error"
	onClose: () => void
}

const alertStyles = {
	info: "bg-blue-100 border-blue-500 text-blue-700",
	success: "bg-green-100 border-green-500 text-green-700",
	warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
	error: "bg-red-100 border-red-500 text-red-700",
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
	return (
		<div className={`border-l-4 p-4 ${alertStyles[type]}`} role="alert">
			<div className="flex">
				<div className="py-1">
					<svg
						className={`fill-current h-6 w-6 mr-4`}
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
					>
						<path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm-1-5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm0-4a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" />
					</svg>
				</div>
				<div>
					<p className="font-bold">
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</p>
					<p className="text-sm">{message}</p>
				</div>
				<button onClick={onClose} className="ml-auto">
					<svg
						className="fill-current h-6 w-6"
						role="button"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
					>
						<title>Close</title>
						<path d="M14.348 14.849a1 1 0 0 1-1.414 0L10 11.414l-2.93 2.93a1 1 0 1 1-1.414-1.414l2.93-2.93-2.93-2.93a1 1 0 1 1 1.414-1.414L10 8.586l2.93-2.93a1 1 0 1 1 1.414 1.414L11.414 10l2.93 2.93a1 1 0 0 1 0 1.414z" />
					</svg>
				</button>
			</div>
		</div>
	)
}

export default Alert
