import * as Cell from "../../lib/cell"
import * as Unit from "./unit"

export function create(data) {
	let map = {
		width: data.width,
		height: data.height,
		units: []
	}
	for (let { name, type, faction, pos, stats } of data.units) {
		let cell = Cell.create(...pos)
		let unit = Unit.create(name, type, faction, cell, stats)
		map.units.push(unit)
	}
	return map
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
