import * as Map from "./map"
import * as Unit from "./unit"
import * as Cell from "../../lib/cell"

export function create(map) {
	let units = map.units.map(unit => Unit.create(...unit))
	for (let i = 0; i < units.length; i++) {
		let unit = units[i]
		// use pointers instead of original data
		// in conversion criteria
		if (unit.control.convert) {
			let other = map.units.find(other => unit.control.convert[2] === other[2])
			let index = map.units.indexOf(other)
			unit.control.convert = units[index]
		}
		// display move for waiting units as 0
		if (unit.control.ai === "wait" && unit.control.faction === "enemy") {
			unit.stats.mov = 0
		}
	}
	return {
		map: Map.create(map.width, map.height, map.layout, units),
		phase: {
			faction: "player",
			pending: units.filter(unit => unit.control.faction === "player")
		}
	}
}

export function move(unit, dest, game) {
	unit.cell = dest
}

// attack function, but from the highest relevant context
// in this case, it just adds removing from the pending
// list if one unit is incapacitated
// could we place these into hooks or something?
export function attack(attack, game) {
	let unit = attack.source
	let target = attack.target
	let opts = {
		map: game.map,
		data: attack
	}
	let removal = Unit.attack(unit, target, opts)
	if (removal) {
		remove(removal, game)
		return removal
	}
	return removal
}

export function remove(unit, game) {
	for (let other of game.map.units) {
		if (other.control.convert !== unit) continue
		other.control = { faction: "player" }
		if (game.phase.faction === "player") {
			game.phase.pending.push(other)
		}
	}
	// removing from map is technically unnecessary
	// but only if this function is being called
	// from the attack function
	let u = game.map.units.indexOf(unit)
	if (u !== -1) {
		game.map.units.splice(u, 1)
	}
	let p = game.phase.pending.indexOf(unit)
	if (p !== -1) {
		game.phase.pending.splice(p, 1)
	}
}

export function endTurn(unit, game) {
	let pending = game.phase.pending
	if (!pending.length) {
		switchPhase(game)
		return true
	}
	let index = pending.indexOf(unit)
	if (index !== -1) {
		pending.splice(index, 1)
		if (!pending.length) {
			switchPhase(game)
		}
		return true
	} else {
		return false
	}
}

export function switchPhase(game) {
	let { map, phase } = game
	if (phase.faction === "player") {
		phase.faction = "enemy"
	} else if (phase.faction === "enemy") {
		phase.faction = "player"
	}
	phase.pending = map.units.filter(unit => unit.control.faction === phase.faction)
	if (!phase.pending.length) {
		switchPhase(game)
	}
}
