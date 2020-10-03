import * as Map from "./map"
import * as Unit from "./unit"
import * as Cell from "./cell"

// findRange(map, unit)
// > finds the unit range (diamond shape)
// > in the format {
// >   move: [ ...cell ]
// >   attack: [ ...cell ]
// > }
export default function findRange(map, unit) {
	let range = {
		move: [ unit.cell ],
		attack: [],
	}

	let mov = Unit.mov(unit.type)
	let rng = Unit.rng(unit.type)
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
			if (range.move.find(cell => Cell.equals(cell, neighbor))) {
				continue
			}
			// check if cell is occupied
			let target = Map.unitAt(map, neighbor)
			if (!target) {
				// no unit here, square is free for movement
				range.move.push(neighbor)
			} else if (!Unit.allied(unit, target)) {
				// different factions, we can attack
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
		for (let neighbor of Cell.neighbors(edge, rng)) {
			if (!Map.contains(map, neighbor)
			 || !Map.walkable(map, neighbor, cell)
			 || Cell.equals(unit.cell, neighbor)
			) continue // can't attack out of bounds, walls, or self
			// if cell doesn't contain an ally,
			// it is within attack range.
			// to disable consistency visual, only
			// cells with enemies should be targeted
			let target = Map.unitAt(map, neighbor)
			if (!target || !Unit.allied(map, target)) {
				// if not a duplicate, add to attack range
				if (!range.attack.find(cell => Cell.equals(cell, neighbor))) {
					range.attack.push(neighbor)
				}
			}
		}
	}
	return range
}
