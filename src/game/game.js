import * as Map from "./map"
import * as Unit from "./unit"

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

export function endTurn(unit, game) {
	let pending = game.phase.pending
	let index = pending.indexOf(unit)
	if (index !== -1) {
		pending.splice(index, 1)
		if (!pending.length) {
			nextPhase(game)
		}
		return true
	} else {
		return false
	}
}

export function nextPhase(game) {
	let { map, phase } = game
	if (phase.faction === "player") {
		phase.faction = "enemy"
	} else if (phase.faction === "enemy") {
		phase.faction = "player"
	}
	phase.pending = map.units.filter(unit => unit.faction === phase.faction)
	if (!phase.pending.length) {
		nextPhase(game)
	}
}
