import * as Cell from "../../lib/cell"
const tiles = {
	" ": { id: "floor", walkable: true },
	"#": { id: "wall", walkable: false }
}

export function create(width, height, layoutdata, units) {
	let layout = []
	for (let y = height; y--;) {
		for (let x = width; x--;) {
			let index = y * width + x
			let char = layoutdata[index]
			layout[index] = tiles[char]
		}
	}
	return { width, height, layout, units }
}

export function at(map, cell) {
	if (!contains(map, cell)) return null
	return map.layout[cell.y * map.width + cell.x]
}

export function contains(map, cell) {
	return cell.x >= 0
	    && cell.y >= 0
	    && cell.x < map.width
	    && cell.y < map.height
}

export function walkable(map, cell, from) {
	return contains(map, cell) && at(map, cell).walkable
}

export function unitAt(map, cell) {
	if (!contains(map, cell)) return
	for (let unit of map.units) {
		if (Cell.equals(unit.cell, cell)) {
			return unit
		}
	}
}

export function remove(map, unit) {
	let u = map.units.indexOf(unit)
	if (u !== -1) {
		map.units.splice(u, 1)
		return true
	} else {
		return false
	}
}
