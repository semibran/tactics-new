import * as Map from "./map"
import * as Cell from "../../lib/cell"
import getWeapon from "./weapon"
import _inRange from "in-range"

export function create(name, type, faction, stats, cell) {
	stats = Object.assign({ mov: 5 }, stats)
	if (type === "knight") {
		stats.mov = 4
	} else if (type === "thief") {
		stats.mov = 6
	}
	return {
		name: name,
		type: type,
		faction: faction,
		cell: cell,
		stats: stats,
		hp: stats.hp,
		wpn: getWeapon(type)
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

export function attack(unit, target) {

}

export function allied(a, b) {
	return a.faction === b.faction
}

// finds the extent of the unit's stationary attack range.
// use inRange for exclusive ranges ie. archers
export function rng(unit) {
	if (unit.type === "mage") return 2
	if (unit.type === "archer") return 2
	return 1
}

export function inRange(unit, cell) {
	let range = unit.wpn.rng
	let steps = Cell.steps(unit.cell, cell)
	return _inRange(steps, range)
}

// dmg(unit, target) -> uint
// > Determines how much damage a single attack
// > by `unit` would deal against `target`.
// > If hit rate is 0 or target is out of range,
// > returns 0 straight away.
export function findDmg(unit, target) {
	let dmg = unit.stats.atk
	if (unit.wpn.stat === "mag") {
		dmg -= target.stats.res
	} else if (unit.wpn.stat === "str" && unit.type !== "fighter") {
		dmg -= target.stats.def
	}
	if (dmg < 0) {
		dmg = 0
	}
	return dmg
}

export function canDouble(unit, target) {
	// TODO: speed threshold?
	return unit.stats.spd - target.stats.spd >= 3
}

export function attackData(unit, target) {
	if (!inRange(unit, target.cell)) {
		return null
	}

	let hit = Math.max(0, unit.stats.hit - target.stats.spd)
	let dmg = hit ? findDmg(unit, target) : 0
	let realdmg = Math.min(dmg, unit.hp)
	if (dmg >= target.hp) {
		return {
			source: unit,
			target: target,
			hit: hit,
			dmg: dmg,
			realdmg: realdmg,
			doubles: false,
			finishes: true
		}
	}

	let counter = null
	if (inRange(target, unit.cell)) {
		let hit = Math.max(0, target.stats.hit - unit.stats.spd)
		let dmg = hit ? findDmg(target, unit) : 0
		counter = {
			source: target,
			target: unit,
			hit: hit,
			dmg: dmg,
			realdmg: dmg
		}

		if (canDouble(target, unit) && counter.dmg < unit.hp) {
			counter.realdmg *= 2
			counter.finishes = counter.realdmg >= unit.hp
			counter.doubles = true
		}
	}

	let finishes = false
	let doubles = false
	if (canDouble(unit, target) && (!counter || counter.dmg < unit.hp)) {
		realdmg *= 2
		finishes = realdmg >= target.hp
		doubles = true
	}

	return {
		source: unit,
		target: target,
		hit: hit,
		dmg: dmg,
		realdmg: realdmg,
		doubles: doubles,
		finishes: finishes,
		counter: counter
	}
}
