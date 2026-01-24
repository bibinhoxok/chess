type State = {
	snake: { x: number; y: number }[]
	direction: { x: number; y: number }
	nextDir: { x: number; y: number }
	food: { x: number; y: number }
	score: number
	gameSpeed: number
	gameRunning: boolean
	autopilot: boolean
	godMode: boolean
	isPaused: boolean
	inputQueue: string[]
}
const GRID_SIZE = 20
const createInitialState = () => ({
	snake: [{ x: 10, y: 10 }],
	direction: { x: 1, y: 0 },
	nextDir: { x: 1, y: 0 },
	food: { x: 15, y: 15 },
	score: 0,
	gameSpeed: 60000 / 360,
	gameRunning: true,
	autopilot: false,
	godMode: false,
	isPaused: false,
	inputQueue: [],
})

const isCollision = (
	point: { x: number; y: number },
	snake: { x: number; y: number }[],
) => {
	return snake
		.slice(1)
		.some((segment) => segment.x === point.x && segment.y === point.y)
}

// --- A* Pathfinding (Functional Approach) ---
const getAutopilotDirection = (state: State) => {
	const start = state.snake[0]
	const target = state.food

	// Recursive solver for the path
	const findPath = (
		openSet: {
			x: number
			y: number
			g: number
			h: number
			f: number
			parent: any
		}[],
		closedSet: { x: number; y: number }[],
	) => {
		// Base case: No path found
		if (openSet.length === 0) {
			return null
		}

		// Find the best next step
		const current = openSet.reduce((a, b) => (a.f < b.f ? a : b))

		// Base case: Found the path
		if (current.x === target.x && current.y === target.y) {
			let path = []
			let temp = current
			while (temp.parent) {
				path.push({ x: temp.x, y: temp.y })
				temp = temp.parent
			}
			return path.reverse()
		}

		// Move current from open to closed (immutably)
		const nextOpenSet = openSet.filter((node) => node !== current)
		const nextClosedSet = [...closedSet, current]

		const neighbors = [
			{ x: (current.x + 1 + GRID_SIZE) % GRID_SIZE, y: current.y },
			{ x: (current.x - 1 + GRID_SIZE) % GRID_SIZE, y: current.y },
			{ x: current.x, y: (current.y + 1 + GRID_SIZE) % GRID_SIZE },
			{ x: current.x, y: (current.y - 1 + GRID_SIZE) % GRID_SIZE },
		]

		// Process neighbors and update open set for the next recursion
		const finalOpenSet = neighbors.reduce((accOpenSet, neighbor) => {
			if (
				nextClosedSet.find(
					(s) => s.x === neighbor.x && s.y === neighbor.y,
				) ||
				isCollision(neighbor, state.snake)
			) {
				return accOpenSet // Skip this neighbor
			}

			const g = current.g + 1
			const h =
				Math.abs(neighbor.x - target.x) +
				Math.abs(neighbor.y - target.y)
			const f = g + h

			const existingIndex = accOpenSet.findIndex(
				(s) => s.x === neighbor.x && s.y === neighbor.y,
			)

			if (existingIndex === -1) {
				// Add new node
				return [
					...accOpenSet,
					{ ...neighbor, g, h, f, parent: current },
				]
			}

			const existing = accOpenSet[existingIndex]
			if (g < existing.g) {
				// Replace with better path
				const updatedAcc = [...accOpenSet]
				updatedAcc[existingIndex] = {
					...neighbor,
					g,
					h,
					f,
					parent: current,
				}
				return updatedAcc
			}

			// No change, return accumulator
			return accOpenSet
		}, nextOpenSet)

		return findPath(finalOpenSet, nextClosedSet)
	}

	// --- Initial Call to the recursive solver ---
	const initialOpenSet = [
		{ x: start.x, y: start.y, g: 0, h: 0, f: 0, parent: null },
	]
	const finalPath = findPath(initialOpenSet, [])

	if (finalPath && finalPath.length > 0) {
		return { x: finalPath[0].x - start.x, y: finalPath[0].y - start.y }
	}

	return state.direction // Fallback
}
