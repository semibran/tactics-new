import * as Cell from "../../lib/cell"
import * as Unit from "./unit"
import * as Map from "./map"
import nbrhd from "./neighborhood"
import findRange from "./range"
import inRange from "in-range"
import pathfind from "./pathfind"
import astar from "../../lib/pathfind"
import unwalkables from "./unwalkables"

const aifuncs = { attack, guard, wait }

export default function analyze(map, units) {
	let mapcopy = {
		width: map.width,
		height: map.height,
		layout: map.layout,
		units: map.units
			.map(unit => Object.assign({ real: unit }, unit))
	}

	// TODO: perform smart sort
	let indices = units.map(unit => map.units.indexOf(unit))
	let strategy = mapcopy.units
		.filter((unit, index) => indices.includes(index) && unit.control.ai)
		.map(unit => aifuncs[unit.control.ai](unit, mapcopy))

	for (let i = 0; i < strategy.length; i++) {
		let sequence = strategy[i]
		let unit = units[i]
		for (let command of sequence) {
			if (command.type === "move") {
				command.unit = command.unit.real
			} else if (command.type === "attack") {
				let attack = command.attack
				if (!attack) continue
				attack.source = attack.source.real
				attack.target = attack.target.real
				if (!attack.counter) continue
				let counter = attack.counter
				counter.source = counter.source.real
				counter.target = counter.target.real
			}
		}
		// sequence.push({ type: "endTurn", unit })
	}

	return strategy
}

// ai functions
// fn(unit, map) -> commandlist
// TODO: actually perform actions on the given map for better lookaheads
// TODO: more reliable indexing; prone to breaking as units are removed

// stay in one place, but attack if an enemy is in direct attack range
function wait(unit, map) {
	let cmd = []
	let targets = nbrhd(unit.cell, unit.wpn.rng)
		.map(cell => map.units.find(unit => Cell.equals(cell, unit.cell)))
		.filter(target => !!target && !Unit.allied(unit, target))
	let target = targets[0]
	if (target) {
		let attack = Unit.attackData(unit, target)
		Unit.attack(unit, target, { map, data: attack })
		cmd.push({ type: "attack", attack })
		console.log(unit.name, "can target", targets.map(target => target.name).join(", "))
		console.log("Chose", target.name, attack)
	}
	return cmd
}

// stay in one place, but give chase if an enemy is in range
// TODO: store initial pos and return there if no enemies to attack
// OR: use initial range instead of current range
function guard(unit, map, opts) {
	opts = Object.assign({}, opts)
	let range = opts.range
	if (!range) range = findRange(unit, map)
	let targets = range.squares
		.filter(square => square.target && square.target.control.faction === "player")
		.map(square => square.target)
	// TODO: sort targets
	let target = targets[0]
	if (!target) return []
	if (inRange(Cell.steps(unit.cell, target.cell), unit.wpn.rng)) {
		let attack = Unit.attackData(unit, target)
		return [ { type: "attack", attack } ]
	} else {
		let neighbors = nbrhd(target.cell, unit.wpn.rng)
			.filter(cell => range.squares.find(square => {
				return square.type === "move" && Cell.equals(square.cell, cell)
			}))
			.sort((a, b) => Cell.steps(a, unit.cell) - Cell.steps(b, unit.cell))

		let dest = neighbors.shift()
		while (!dest && neighbors.length) {
			dest = neighbors.shift()
		}

		if (!dest) {
			return []
		}

		let path = pathfind(unit, dest, map)
		unit.cell = dest

		let attack = Unit.attackData(unit, target)
		return [
			{ type: "move", unit, path },
			{ type: "attack", unit, attack }
		]
	}
	return []
}

// bullrush the closest enemy
function attack(unit, map) {
	let range = findRange(unit, map)
	let cmd = guard(unit, map, { range })
	if (cmd.length) return cmd
	let targets = map.units.filter(other => other.control.faction === "player")
		.sort((a, b) => Cell.steps(a.cell, unit.cell) - Cell.steps(b.cell, unit.cell))
	let target = targets[0]
	if (!target) return []
	let moves = range.squares.filter(square => square.type === "move")
		.map(square => square.cell)
	let opts = {
		width: map.width,
		height: map.height,
		blacklist: unwalkables(map, unit)
	}
	let paths = moves.map(cell => astar(target.cell, cell, opts))
	let indices = moves.map((_, i) => i)
	indices.sort((a, b) => paths[a].length - paths[b].length)
	let index = indices[0]
	let dest = moves[index]
	let path = pathfind(unit, dest, map)
	return [ { type: "move", unit, path } ]
}

function priority(attack) {

}
