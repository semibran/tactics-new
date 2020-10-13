import * as Cell from "../../lib/cell"

export function create(width, height, units) {
	return { width, height, units }
}

export function contains(map, cell) {
	return Cell.x(cell) >= 0
	    && Cell.y(cell) >= 0
	    && Cell.x(cell) < map.width
	    && Cell.y(cell) < map.height
}

export function walkable(map, cell, from) {
	return contains(map, cell)
}

export function unitAt(map, cell) {
	if (!contains(map, cell)) return
	for (let unit of map.units) {
		if (Cell.equals(unit.cell, cell)) {
			return unit
		}
	}
}
