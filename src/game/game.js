import * as Map from "./map"
import * as Unit from "./unit"
import * as Cell from "../../lib/cell"

export function create(map) {
	let units = map.units.map(unit => Unit.create(...unit))
	return {
		map: Map.create(map.width, map.height, units),
		phase: {
			faction: "player",
			pending: units.filter(unit => unit.faction === "player")
		}
	}
}

export function move(unit, dest, game) {
	unit.cell = dest
}

export function attack(unit, target, game) {
	if (Cell.distance(unit.cell, target.cell) > Unit.rng(unit)) return false
	let dmg = Unit.dmg(unit, target)
	if (dmg) {
		target.hp = Math.max(0, target.hp - dmg)
		if (target.hp <= 0) {
			// remove unit from playing field
			let index = game.map.units.indexOf(target)
			if (index !== -1) {
				game.map.units.splice(index, 1)
			}
		}
	}
}

export function endTurn(unit, game) {
	let pending = game.phase.pending
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
