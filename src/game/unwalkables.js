import * as Map from "./map"
import * as Unit from "./unit"
import * as Cell from "../../lib/cell"

export default function unwalkables(map, unit) {
	let unwalkables = []
	for (let y = map.height; y--;) {
		for (let x = map.width; x--;) {
			let cell = { x, y }
			if (!Map.at(map, cell).walkable) {
				unwalkables.push(cell)
				continue
			}
			let enemy = map.units.find(other => {
				return Cell.equals(other.cell, cell) && !Unit.allied(unit, other)
			})
			if (enemy) {
				unwalkables.push(cell)
			}
		}
	}
	return unwalkables
}
