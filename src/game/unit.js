import * as Map from "./map"
import * as Cell from "../../lib/cell"

export function create(name, type, faction, cell, stats) {
	return {
		name: name,
		type: type,
		faction: faction,
		cell: cell,
		stats: stats,
	}
}

export function move(unit, dest, map) {
	if (Map.walkable(map, unit.cell, dest)) {
		unit.cell = dest
		return true
	} else {
		return false
	}
}

export function allied(a, b) {
	return a.faction === b.faction
}

export function mov(unit) {
	if (unit.type === "knight") return 4
	if (unit.type === "thief") return 6
	return 5
}

export function rng(unit) {
	if (unit.type === "mage") return 2
	if (unit.type === "archer") return 2
	return 1
}

export function dmg(unit, target) {
	if (hit(unit, target) <= 0) {
		return null
	}
	let dmg = unit.stats.atk - target.stats.def
	if (dmg < 0) {
		dmg = 0
	}
	return dmg
}

export function hit(unit, target) {
	if (Cell.distance(unit.cell, target.cell) > rng(unit)) {
		return null
	}
	return unit.stats.hit - target.stats.spd
}
