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
		unit: data.unit,
		target: data.target,
		atkr: data.unit,
		defr: data.target,
		log: null,
		anim: null,
		lhshp: null,
		rhshp: null,
		atkrhp: null,
		defrhp: null,
		attacks: [],
		comps: [],
		commands: []
	}
}

export function onenter(mode, screen) {
	let sprites = screen.sprites
	let atkr = mode.unit
	let defr = mode.target

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

	let attack = Unit.attackData(atkr, defr)
	if (!attack) {
		throw new Error("Failed to create attack data: Attempting to attack an enemy out of range. Reinforce range detection procedures before entering attack mode.")
	}

	// queue up attacks
	mode.attacks.push({ type: "init", data: attack })
	if (!attack.finishes && attack.counter) {
		mode.attacks.push({ type: "counter", data: attack.counter })
		if (!attack.counter.finishes && attack.counter.doubles && attack.counter.dmg) {
			mode.attacks.push({ type: "double", data: attack.counter })
		}
	}
	if (!attack.finishes && attack.doubles && attack.dmg
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
			if (attack.data.source === mode.atkr) {
				mode.atkrhp = mode.lhshp
				mode.defrhp = mode.rhshp
			} else {
				mode.atkrhp = mode.rhshp
				mode.defrhp = mode.lhshp
			}
			Camera.center(camera, screen.map, defr.cell)
			camera.target.y -= camera.height / 2
			camera.target.y += (camera.height - 44) / 2
			attack.data.connect = false
		} else if (anim && anim.connect && !attack.data.connect) {
			attack.data.connect = true
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
			} else  if (defr.faction === "player") {
				Log.append(log, `${defr.name} suffers ${attack.data.dmg} damage.`)
			} else if (defr.faction === "enemy") {
				Log.append(log, `${defr.name} receives ${attack.data.dmg} damage.`)
			}

			if (attack.dmg >= defr.hp && defr.faction === "player") {
				Log.append(log, `${defr.name} is defeated.`)
			} else if (attack.dmg >= defr.hp && defr.faction === "enemy") {
				Log.append(log, `Defeated ${defr.name}.`)
			}
		} else if (!anim) {
			let duration = mode.attacks.length === 1
				? finalDuration
				: attackDuration
			if (screen.time - attack.time >= duration) {
				mode.commands.push({ type: "attack", unit: atkr, target: defr })
				mode.attacks.shift()
			}
		}
	} else {
		mode.commands.push({
			type: "endTurn",
			unit: mode.atkr
		})
		mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}
