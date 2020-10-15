import * as Log from "./comp-log"
import * as Unit from "./unit"
import * as Cell from "../../lib/cell/"
import * as PieceAttack from "../anims/piece-attack"

const attackDuration = 45

export function create(data) {
	return {
		id: "Attack",
		unit: data.unit,
		target: data.target,
		log: null,
		anim: null,
		attacks: [],
		comps: [],
		commands: []
	}
}

export function onenter(mode, screen) {
	let sprites = screen.sprites
	let atkr = mode.unit
	let defr = mode.target

	mode.log = Log.create()
	mode.comps.push(mode.log)

	let damage = Unit.dmg(atkr, defr)
	mode.attacks.push({
		source: atkr,
		target: defr,
		damage: damage,
		time: 0,
		connect: false,
		counter: false
	})

	if (Number(damage) < defr.hp && Cell.distance(defr.cell, atkr.cell) <= Unit.rng(defr)) {
		let damage = Unit.dmg(defr, atkr)
		mode.attacks.push({
			source: defr,
			target: atkr,
			damage: damage,
			time: 0,
			connect: false,
			counter: true
		})
	}
}

export function onrelease(mode, screen, pointer) {
	// TODO: buttons
	if (pointer.mode === "click") {

		// mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}

export function onupdate(mode, screen) {
	let anim = mode.anim
	let cache = mode.cache
	let atkr = mode.unit
	let defr = mode.target
	let log = mode.log

	let attack = mode.attacks[0]
	if (attack) {
		let atkr = attack.source
		let defr = attack.target
		let anim = mode.anim
		if (!attack.time) {
			mode.anim = PieceAttack.create(atkr.cell, defr.cell)
			mode.unit = atkr
			attack.time = screen.time
		} else if (anim && anim.connect && !attack.connect) {
			attack.connect = true
			Log.append(log, `${atkr.name} ${attack.counter ? "counters" : "attacks"}`)
			if (attack.damage === 0) {
				Log.append(log, `${defr.name} blocks the attack.`)
			} else if (attack.damage === null) {
				Log.append(log, `${defr.name} dodges the attack.`)
			} else if (defr.faction === "player") {
				Log.append(log, `${defr.name} suffers ${attack.damage} damage.`)
			} else if (defr.faction === "enemy") {
				Log.append(log, `${defr.name} receives ${attack.damage} damage.`)
			}
		} else if (!anim && screen.time - attack.time >= attackDuration) {
			mode.attacks.shift()
		}
	} else {
		mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}
