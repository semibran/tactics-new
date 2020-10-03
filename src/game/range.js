import * as Cell from "../../lib/cell"
import * as Unit from "./unit"
import * as Map from "./map"

// findRange(unit, map)
// > finds the unit range (diamond shape)
// > in the format {
// >   move: [ ...cell ]
// >   attack: [ ...cell ]
// > }
export default function findRange(unit, map) {
	let range = {
		move: [ unit.cell ],
		attack: [],
	}

	let mov = Unit.mov(unit)
	let rng = Unit.rng(unit)
	let start = { steps: 0, cell: unit.cell }
	let queue = [ start ]
	let edges = []
	if (!mov) {
		queue.length = 0
		edges.push(unit.cell)
	}

	// initial search: simulate movement to all possible locations
	while (queue.length) {
		let node = queue.shift()
		for (let neighbor of Cell.neighbors(node.cell)) {
			// exclude walls
			if (!Map.walkable(map, neighbor, node.cell)) {
				continue
			}
			// avoid duplicates
			if (range.move.find(cell => Cell.equals(neighbor, cell))) {
				continue
			}
			// check if cell is occupied
			let target = Map.unitAt(map, neighbor)
			if (!target) {
				// no unit here, square is free for movement
				range.move.push(neighbor)
			} else if (!Unit.allied(unit, target)
			&& range.attack.find(cell => Cell.equals(neighbor, cell))
			) {
				// different factions and not a duplicate. we can attack
				range.attack.push(neighbor)
			}
			// maximum steps
			if (node.steps < mov - 1) {
				// we can consider cells with allied units. it's
				// fine since they aren't added to the movement range
				if (!target || Unit.allied(unit, target)) {
					queue.push({
						steps: node.steps + 1,
						cell: neighbor
					})
				}
			} else {
				// we've reached the extent of the range
				// range perimeter. take a note of this cell
				edges.push(neighbor)
			}
		}
	}

	// second search: determine actions along the movement perimeter
	// without this section, we wouldn't be able to attack enemies
	// unless they are `mov` steps away from the central unit
	for (let edge of edges) {
		for (let neighbor of Cell.neighborhood(edge, rng)) {
			if (!Map.contains(map, neighbor)
			 || !Map.walkable(map, neighbor, edge)
			 || Cell.equals(unit.cell, neighbor)
			) continue // can't attack out of bounds, walls, or self

			// if cell doesn't contain an ally,
			// it is within attack range.
			// to disable consistency visual, only
			// cells with enemies should be targeted
			let target = Map.unitAt(map, neighbor)
			if (!target || !Unit.allied(map, target)) {
				if (range.move.find(cell => Cell.equals(neighbor, cell))) {
					continue
				}
				if (range.attack.find(cell => Cell.equals(neighbor, cell))) {
					continue
				}
				range.attack.push(neighbor)
			}
		}
	}
	return range
}
