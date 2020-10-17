import * as Log from "./comp-log"
import * as Hp from "./comp-hp"
import * as Camera from "./camera"
import * as Unit from "./unit"
import * as Cell from "../../lib/cell/"
import * as PieceAttack from "../anims/piece-attack"

const attackDuration = 50
const finalDuration = 70

export function create(data) {
	return {
		id: "Attack",
		comps: [],
		commands: [],
		exit: false,
		data: data,
		unit: data.source,
		target: data.target,
		atkrhp: null,
		defrhp: null,
		lhshp: null,
		rhshp: null,
		log: null,
		anim: null,
		attacks: []
	}
}

export function onenter(mode, screen) {
	let sprites = screen.sprites
	let atkr = mode.unit
	let defr = mode.target
	let attack = mode.data
	if (!attack) {
		throw new Error("Failed to create attack data: Attempting to attack an enemy out of range. Reinforce range detection procedures before entering attack mode.")
	}

	for (let comp of mode.comps) {
		if (comp.id !== "Hp") continue
		comp.mode = "static"
		if (!comp.opts.flipped) {
			mode.lhshp = comp
		} else {
			mode.rhshp = comp
		}
	}

	mode.log = Log.create()
	mode.comps.push(mode.log)

	// queue up attacks
	mode.attacks.push({ type: "init", data: attack })
	if (attack.dmg < attack.target.hp && attack.counter) {
		mode.attacks.push({ type: "counter", data: attack.counter })
		if (attack.counter.dmg && !attack.counter.finishes && attack.counter.doubles) {
			mode.attacks.push({ type: "double", data: attack.counter })
		}
	}
	if (attack.dmg && attack.dmg < attack.target.hp && attack.doubles
	&& (!attack.counter || !attack.counter.finishes)
	) {
		mode.attacks.push({ type: "double", data: attack })
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
	let camera = screen.camera

	let attack = mode.attacks[0]
	if (attack) {
		let atkr = attack.data.source
		let defr = attack.data.target
		let anim = mode.anim
		if (!attack.time) {
			mode.anim = PieceAttack.create(atkr.cell, defr.cell)
			mode.unit = atkr
			mode.target = defr
			attack.time = screen.time
			if (attack.data.source === mode.data.source) {
				mode.atkrhp = mode.lhshp
				mode.defrhp = mode.rhshp
			} else {
				mode.atkrhp = mode.rhshp
				mode.defrhp = mode.lhshp
			}
			Camera.center(camera, screen.map, defr.cell)
			camera.target.y -= camera.height / 2
			camera.target.y += (camera.height - 44) / 2
			attack.connect = false
		} else if (anim && anim.connect && !attack.connect) {
			attack.connect = true
			Hp.startReduce(mode.defrhp, attack.data.dmg)

			if (attack.type === "init") {
				Log.append(log, `${atkr.name} attacks`)
			} else if (attack.type === "counter") {
				Log.append(log, `${atkr.name} counters`)
			} else if (attack.type === "double") {
				Log.append(log, `${atkr.name} attacks again`)
			}

			if (!attack.data.hit) {
				Log.append(log, `${defr.name} dodges the attack.`)
			} else if (!attack.data.dmg) {
				Log.append(log, `${defr.name} blocks the attack.`)
			} else  if (Unit.allied(defr, mode.data.source)) {
				Log.append(log, `${defr.name} suffers ${attack.data.dmg} damage.`)
			} else if (!Unit.allied(defr, mode.data.source)) {
				Log.append(log, `${defr.name} receives ${attack.data.dmg} damage.`)
			}

			if (attack.data.dmg >= defr.hp && Unit.allied(mode.data.source, defr)) {
				Log.append(log, `${defr.name} is defeated.`)
			} else if (attack.data.dmg >= defr.hp && !Unit.allied(mode.data.source, defr)) {
				Log.append(log, `Defeated ${defr.name}.`)
			}
		} else if (!anim) {
			let duration = mode.attacks.length === 1
				? finalDuration
				: attackDuration
			if (screen.time - attack.time >= duration) {
				mode.attacks.shift()
			}
		}
	} else if (!mode.exit) {
		mode.exit = true
		mode.commands.push({ type: "attack", data: mode.data })
		mode.commands.push({ type: "endTurn",	unit: mode.data.source })
		mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}
