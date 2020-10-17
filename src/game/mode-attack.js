import * as Comps from "./comps"
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
		data: data.attack,
		unit: data.attack.source,
		target: data.attack.target,
		onend: data.onend,
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
	let sprites = screen.view.sprites
	let atkr = mode.unit
	let defr = mode.target
	let attack = mode.data
	if (!attack) {
		throw new Error("Failed to create attack data: Attempting to attack an enemy out of range. Reinforce range detection procedures before entering attack mode.")
	}

	for (let comp of mode.comps) {
		if (comp.id !== "Hp" || comp.exit) continue
		comp.mode = "static"
		if (!comp.opts.flipped) {
			mode.lhshp = comp
		} else {
			mode.rhshp = comp
		}
	}

	// not attacking from forecast (probably an enemy)
	// TODO: make this entire thing into a component
	if (!mode.lhshp && !mode.rhshp) {
		// add attacker name tag & hp
		let atktag = Comps.Tag.create(atkr.name, atkr.control.faction, sprites)
		let atkrhp = Comps.Hp.create(atkr.hp, atkr.stats.hp, atkr.control.faction)
		mode.comps.push(atktag)
		mode.comps.push(atkrhp)
		mode.lhshp = atkrhp

		// add defender tag & hp
		let deftag = Comps.Tag.create(defr.name, defr.control.faction, sprites, { flipped: true })
		let defrhp = Comps.Hp.create(defr.hp, defr.stats.hp, defr.control.faction, { flipped: true })
		mode.comps.push(deftag)
		mode.comps.push(defrhp)
		mode.rhshp = defrhp

		// add vs diamond
		let vs = Comps.Vs.create(sprites)
		mode.comps.push(vs)
	}

	mode.log = Comps.Log.create()
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

	init(mode.attacks[0], mode)
	console.log("attacks", ...mode.attacks)
	console.log(mode.anim)
}

export function onexit(mode) {
	for (let comp of mode.comps) {
		if (comp.id === "Home") continue
		Comps[comp.id].exit(comp)
	}
}

export function onrelease(mode, screen, pointer) {
	// TODO: buttons
	if (pointer.mode === "click") {
		// mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}

function init(attack, mode) {
	let atkr = mode.unit
	let defr = mode.target
	attack.init = true
	mode.anim = PieceAttack.create(atkr.cell, defr.cell)
	mode.unit = atkr
	mode.target = defr
	if (attack.data.source === mode.data.source) {
		mode.atkrhp = mode.lhshp
		mode.defrhp = mode.rhshp
	} else {
		mode.atkrhp = mode.rhshp
		mode.defrhp = mode.lhshp
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
			attack.time = screen.time
			if (!attack.init) init(attack, mode)
			Camera.center(camera, screen.map, defr.cell)
			camera.target.y -= camera.height / 2
			camera.target.y += (camera.height - 44) / 2
			attack.connect = false
		} else if (anim && anim.connect && !attack.connect) {
			attack.connect = true
			Comps.Hp.startReduce(mode.defrhp, attack.data.dmg)

			if (attack.type === "init") {
				Comps.Log.append(log, `${atkr.name} attacks`)
			} else if (attack.type === "counter") {
				Comps.Log.append(log, `${atkr.name} counters`)
			} else if (attack.type === "double") {
				Comps.Log.append(log, `${atkr.name} attacks again`)
			}

			if (!attack.data.hit) {
				Comps.Log.append(log, `${defr.name} dodges the attack.`)
			} else if (!attack.data.dmg) {
				Comps.Log.append(log, `${defr.name} blocks the attack.`)
			} else  if (Unit.allied(defr, mode.data.source)) {
				Comps.Log.append(log, `${defr.name} suffers ${attack.data.dmg} damage.`)
			} else if (!Unit.allied(defr, mode.data.source)) {
				Comps.Log.append(log, `${defr.name} receives ${attack.data.dmg} damage.`)
			}

			if (attack.data.dmg >= defr.hp && Unit.allied(mode.data.source, defr)) {
				Comps.Log.append(log, `${defr.name} is defeated.`)
			} else if (attack.data.dmg >= defr.hp && !Unit.allied(mode.data.source, defr)) {
				Comps.Log.append(log, `Defeated ${defr.name}.`)
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
		mode.commands.push({ type: "endTurn",	unit: mode.data.source })
		mode.onend && mode.onend()
	}
}
