// @ts-nocheck
// Dummy interfaces for game-specific functions and enums.
// In a real scenario, these would be provided by the game environment.
const Entities = {
    Treasure: 'treasure',
    Hedge: 'hedge',
    Wall: 'wall',
    Empty: 'empty'
};

const Items = {
    Weird_Substance: 'weird_substance'
};

declare function harvest(): number;
declare function get_entity_type(): string;
declare function move(direction: 'up' | 'down' | 'left' | 'right'): boolean;
declare function measure(): [number, number] | null;
declare function use(item: string): void;

// --- Core Types for Pathfinding and State Management ---
interface Position {
    x: number;
    y: number;
}

interface Node extends Position {
    g: number; // Cost from start to current node
    h: number; // Heuristic cost from current node to target
    f: number; // Total cost (g + h)
    parent: Node | null;
}

type MazeMap = {
    [key: string]: {
        type: string; // e.g., Entities.Hedge, Entities.Wall
        visited: boolean;
    }
};

interface MazeState {
    pos: Position;
    map: MazeMap;
}

// --- Pure Helper Functions ---

/**
 * Generates a unique key for a position to use in the map.
 */
const posKey = (pos: Position): string => `${pos.x},${pos.y}`;

/**
 * Returns a new map with an updated cell.
 */
const updateMap = (map: MazeMap, pos: Position, type: string, visited: boolean = false): MazeMap => {
    return {
        ...map,
        [posKey(pos)]: { type, visited }
    };
};

// --- A* Pathfinding (Functional Approach) ---

/**
 * The A* pathfinding algorithm, adapted to a functional style.
 * Finds the shortest path between two points on a given map.
 * @param map The discovered map of the maze.
 * @param start The starting position.
 * @param target The target position.
 * @returns An array of positions representing the path, or null if no path is found.
 */
const findPath = (map: MazeMap, start: Position, target: Position): Position[] | null => {
    const startNode: Node = { ...start, g: 0, h: 0, f: 0, parent: null };

    const find = (openSet: Node[], closedSet: Set<string>): Position[] | null => {
        if (openSet.length === 0) {
            return null; // No path found
        }

        const current = openSet.reduce((a, b) => a.f < b.f ? a : b);

        if (current.x === target.x && current.y === target.y) {
            const path: Position[] = [];
            let temp: Node | null = current;
            while (temp) {
                path.push({ x: temp.x, y: temp.y });
                temp = temp.parent;
            }
            return path.reverse().slice(1);
        }

        const nextOpenSet = openSet.filter(node => node !== current);
        const nextClosedSet = new Set(closedSet).add(posKey(current));

        const neighbors = [
            { x: current.x, y: current.y - 1 }, // Up
            { x: current.x, y: current.y + 1 }, // Down
            { x: current.x - 1, y: current.y }, // Left
            { x: current.x + 1, y: current.y }, // Right
        ];

        const finalOpenSet = neighbors.reduce((accOpenSet, neighborPos) => {
            const neighborKey = posKey(neighborPos);
            const mapCell = map[neighborKey];

            if (nextClosedSet.has(neighborKey) || !mapCell || mapCell.type === Entities.Wall) {
                return accOpenSet;
            }

            const g = current.g + 1;
            const h = Math.abs(neighborPos.x - target.x) + Math.abs(neighborPos.y - target.y);
            const f = g + h;

            const existingIndex = accOpenSet.findIndex(n => n.x === neighborPos.x && n.y === neighborPos.y);
            if (existingIndex === -1) {
                return [...accOpenSet, { ...neighborPos, g, h, f, parent: current }];
            }

            if (g < accOpenSet[existingIndex].g) {
                const updatedAcc = [...accOpenSet];
                updatedAcc[existingIndex] = { ...neighborPos, g, h, f, parent: current };
                return updatedAcc;
            }

            return accOpenSet;
        }, nextOpenSet);

        return find(finalOpenSet, nextClosedSet);
    };

    return find([startNode], new Set());
};

// --- Impure Functions (Interacting with the World) ---

/**
 * Follows a given path, updating state along the way.
 * This is an impure function as it calls `move()` which has side effects.
 * @returns A new state representing the drone's position and map after moving.
 */
const followPath = (initialState: MazeState, path: Position[]): MazeState => {
    return path.reduce((state, nextPos) => {
        const dx = nextPos.x - state.pos.x;
        const dy = nextPos.y - state.pos.y;
        let dir: 'up' | 'down' | 'left' | 'right';

        if (dx === 1) dir = 'right';
        else if (dx === -1) dir = 'left';
        else if (dy === 1) dir = 'down';
        else dir = 'up';

        if (move(dir)) {
            const newMap = (state.map[posKey(nextPos)]?.type === Entities.Wall)
                ? updateMap(state.map, nextPos, Entities.Hedge, true)
                : state.map;
            return { pos: nextPos, map: newMap };
        } else {
            throw new Error(`Failed to follow a calculated path. Blocked at ${posKey(state.pos)} -> ${dir}`);
        }
    }, initialState);
};

/**
 * Explores the maze to find the treasure.
 * This is an impure, recursive function that explores, moves, and updates state.
 * @returns A tuple of [final state, treasure position] or [final state, null].
 */
const exploreForTreasure = (state: MazeState, frontier: Position[], explored: Set<string>): [MazeState, Position | null] => {
    if (get_entity_type() === Entities.Treasure) {
        const newMap = updateMap(state.map, state.pos, Entities.Treasure, true);
        return [{ ...state, map: newMap }, state.pos];
    }

    if (frontier.length === 0) {
        return [state, null]; // Nothing left to explore
    }

    const nextTarget = frontier[0];
    const remainingFrontier = frontier.slice(1);

    // 1. Go to the next location in the frontier
    const pathToTarget = findPath(state.map, state.pos, nextTarget);
    if (!pathToTarget) {
        // Should not happen in a connected maze, but as a safeguard:
        return exploreForTreasure(state, remainingFrontier, explored);
    }
    const stateAfterMoving = followPath(state, pathToTarget);

    // 2. At the new location, explore neighbors
    const directions: Record<string, { dir: 'up' | 'down' | 'left' | 'right', diff: Position }> = {
        up: { dir: 'up', diff: { x: 0, y: -1 } },
        down: { dir: 'down', diff: { x: 0, y: 1 } },
        left: { dir: 'left', diff: { x: -1, y: 0 } },
        right: { dir: 'right', diff: { x: 1, y: 0 } },
    };

    let currentState = stateAfterMoving;
    let newFrontier = [...remainingFrontier];
    let newExplored = new Set(explored);

    for (const { dir, diff } of Object.values(directions)) {
        const neighborPos = { x: currentState.pos.x + diff.x, y: currentState.pos.y + diff.y };
        const neighborKey = posKey(neighborPos);

        if (!newExplored.has(neighborKey)) {
            newExplored.add(neighborKey);
            if (move(dir)) {
                // Moved successfully, found a new path
                const stateAfterNeighborMove = { pos: neighborPos, map: updateMap(currentState.map, neighborPos, Entities.Hedge, true) };
                newFrontier.push(neighborPos);

                // Move back to continue exploration from the central spot
                const oppositeDir = { up: 'down', down: 'up', left: 'right', right: 'left' }[dir];
                move(oppositeDir as any);
                // The drone is back at `currentState.pos`, so state is `currentState` but with an updated map
                currentState = { ...currentState, map: stateAfterNeighborMove.map };
            } else {
                // Hit a wall
                currentState = { ...currentState, map: updateMap(currentState.map, neighborPos, Entities.Wall) };
            }
        }
    }

    return exploreForTreasure(currentState, newFrontier, newExplored);
};

// --- Main Orchestration Functions ---

/**
 * Main function to solve the maze from a given state.
 */
const solveMaze = (initialState: MazeState): [MazeState, number | null] => {
    console.log("Starting maze exploration...");
    const [stateAfterExplore, treasurePos] = exploreForTreasure(
        initialState,
        [initialState.pos],
        new Set([posKey(initialState.pos)])
    );

    if (treasurePos) {
        console.log(`Treasure found at (${treasurePos.x}, ${treasurePos.y}).`);
        const path = findPath(stateAfterExplore.map, stateAfterExplore.pos, treasurePos);

        if (path) {
            console.log("Path to treasure found. Moving to harvest.");
            const finalState = followPath(stateAfterExplore, path);
            const gold = harvest();
            console.log(`Harvested ${gold} gold!`);
            return [finalState, gold];
        } else {
            console.error("Could not find a path to the treasure after discovering it.");
            return [stateAfterExplore, null];
        }
    } else {
        console.error("Explored the entire maze but could not find the treasure.");
        return [stateAfterExplore, null];
    }
};

/**
 * Solves the next iteration of the maze (extra challenge).
 */
const solveNextMaze = (currentState: MazeState): [MazeState, number | null] => {
    if (get_entity_type() !== Entities.Treasure) {
        console.error("Not on a treasure, cannot attempt to solve the next maze.");
        return [currentState, null];
    }

    const nextPosTuple = measure();
    if (!nextPosTuple) {
        console.log("Maze cannot be reused anymore. Final harvest.");
        const gold = harvest();
        return [currentState, gold];
    }

    console.log("Reusing maze...");
    use(Items.Weird_Substance);

    const nextTreasurePos = { x: nextPosTuple[0], y: nextTreasurePos[1] };
    console.log(`Next treasure will be at (${nextTreasurePos.x}, ${nextTreasurePos.y}).`);

    const path = findPath(currentState.map, currentState.pos, nextTreasurePos);
    if (path) {
        const finalState = followPath(currentState, path);
        const gold = harvest();
        console.log(`Harvested ${gold} gold from reused maze!`);
        return [finalState, gold];
    } else {
        console.log("Path not found on current map. Re-exploring...");
        return solveMaze(currentState);
    }
};


// --- Example Usage ---
/*
const initialMazeState: MazeState = {
    pos: { x: 0, y: 0 },
    map: updateMap({}, { x: 0, y: 0 }, Entities.Hedge, true)
};

let [stateAfterSolve, gold] = solveMaze(initialMazeState);

if (gold !== null) {
    for (let i = 0; i < 299; i++) {
        let [nextState, nextGold] = solveNextMaze(stateAfterSolve);
        stateAfterSolve = nextState;
        if (nextGold === null) {
            break; // Stop if maze can't be solved/reused
        }
    }
}
*/