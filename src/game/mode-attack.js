import * as Log from "./comp-log"
import * as Hp from "./comp-hp"
import * as Camera from "./camera"
import * as Unit from "./unit"
import * as Cell from "../../lib/cell/"
import * as PieceAttack from "../anims/piece-attack"

const attackDuration = 50
const finalDuration = 75

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

	let damage = Unit.dmg(atkr, defr)
	mode.attacks.push({
		type: "init",
		source: atkr,
		target: defr,
		damage: damage,
		time: 0,
		connect: false
	})

	let finisher = Number(damage) >= defr.hp
	let dist = Cell.distance(defr.cell, atkr.cell)
	if (!finisher && dist <= Unit.rng(defr)) {
		let damage = Unit.dmg(defr, atkr)
		mode.attacks.push({
			type: "counter",
			source: defr,
			target: atkr,
			damage: damage,
			time: 0,
			connect: false
		})

		let finisher = Number(damage) >= atkr.hp
		if (!finisher && damage && defr.stats.spd > atkr.stats.spd) {
			mode.attacks.push({
				type: "double",
				source: defr,
				target: atkr,
				damage: damage,
				time: 0,
				connect: false
			})
		}
	}

	if (!finisher && damage && atkr.stats.spd > defr.stats.spd) {
		mode.attacks.push({
			type: "double",
			source: atkr,
			target: defr,
			damage: damage,
			time: 0,
			connect: false
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
	let camera = screen.camera

	let attack = mode.attacks[0]
	if (attack) {
		let atkr = attack.source
		let defr = attack.target
		let anim = mode.anim
		if (!attack.time) {
			mode.anim = PieceAttack.create(atkr.cell, defr.cell)
			mode.unit = atkr
			mode.target = defr
			attack.time = screen.time
			if (attack.source === mode.atkr) {
				mode.atkrhp = mode.lhshp
				mode.defrhp = mode.rhshp
			} else {
				mode.atkrhp = mode.rhshp
				mode.defrhp = mode.lhshp
			}
			Camera.center(camera, screen.map, defr.cell)
			camera.target.y -= camera.height / 2
			camera.target.y += (camera.height - 44) / 2
		} else if (anim && anim.connect && !attack.connect) {
			attack.connect = true
			Hp.startReduce(mode.defrhp, attack.damage)

			if (attack.type === "init") {
				Log.append(log, `${atkr.name} attacks`)
			} else if (attack.type === "counter") {
				Log.append(log, `${atkr.name} counters`)
			} else if (attack.type === "double") {
				Log.append(log, `${atkr.name} has a Spd advantage`)
			}

			if (attack.damage === 0) {
				Log.append(log, `${defr.name} blocks the attack.`)
			} else if (attack.damage === null) {
				Log.append(log, `${defr.name} dodges the attack.`)
			} else if (defr.faction === "player") {
				Log.append(log, `${defr.name} suffers ${attack.damage} damage.`)
			} else if (defr.faction === "enemy") {
				Log.append(log, `${defr.name} receives ${attack.damage} damage.`)
			}

			if (attack.damage >= defr.hp && defr.faction === "player") {
				Log.append(log, `${defr.name} is defeated.`)
			} else if (attack.damage >= defr.hp && defr.faction === "enemy") {
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
