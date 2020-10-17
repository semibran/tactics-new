import * as Cell from "../../lib/cell"
import * as Unit from "./unit"

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

	for (let sequence of strategy) {
		for (let command of sequence) {
			if (command.type !== "attack") continue
			let attack = command.attack
			attack.source = attack.source.real
			attack.target = attack.target.real
			if (!attack.counter) continue
			let counter = attack.counter
			counter.source = counter.source.real
			counter.target = counter.target.real
		}
	}

	return strategy
}

function attack(unit, map) {
	return []
}

function guard(unit, map) {
	return []
}

function wait(unit, map) {
	let commands = []
	let targets = Cell.neighborhood(unit.cell, unit.wpn.rng.end)
		.map(cell => map.units.find(unit => Cell.equals(cell, unit.cell)))
		.filter(item => !!item)
	let target = targets[0]
	if (target) {
		let attack = Unit.attackData(unit, target)
		commands.push({ type: "attack", attack })
	}
	return commands
}
