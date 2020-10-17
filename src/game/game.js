import * as Map from "./map"
import * as Unit from "./unit"
import * as Cell from "../../lib/cell"

export function create(map) {
	let units = map.units.map(unit => Unit.create(...unit))
	return {
		map: Map.create(map.width, map.height, map.layout, units),
		phase: {
			faction: "player",
			pending: units.filter(unit => unit.faction === "player")
		}
	}
}

export function move(unit, dest, game) {
	unit.cell = dest
}

export function attack(attack, game) {
	let unit = attack.source
	let target = attack.target
	let counter = attack.counter
	target.hp -= attack.realdmg
	if (counter) {
		unit.hp -= counter.realdmg
	}
	if (!target.hp) {
		remove(target, game)
	} else if (!unit.hp) {
		remove(unit, game)
	}
}

export function remove(unit, game) {
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
	phase.pending = map.units.filter(unit => unit.faction === phase.faction)
	if (!phase.pending.length) {
		switchPhase(game)
	}
}
