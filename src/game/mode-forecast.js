import * as PieceLift from "../anims/piece-lift"
import * as PieceDrop from "../anims/piece-drop"
import * as Hp from "./comp-hp"
import * as Tag from "./comp-tag"
import * as Vs from "./comp-vs"
import * as Back from "./comp-back"
import * as Range from "./comp-range"
import * as StatPanel from "./comp-statpanel"
import * as Camera from "./camera"
import * as Unit from "./unit"
import * as Cell from "../../lib/cell"
import nbrhd from "./neighborhood"


export function create(data) {
	return {
		id: "Forecast",
		unit: data.unit,
		target: data.target,
		attack: Unit.attackData(data.unit, data.target),
		comps: [],
		commands: [],
		anims: [],
		anim: null
	}
}

export function onenter(mode, screen) {
	let sprites = screen.view.sprites
	let atkr = mode.unit
	let defr = mode.target
	let attack = mode.attack
	if (!attack) {
		throw new Error("Failed to create attack data: Attempting to attack an enemy out of range. Reinforce range detection procedures before entering forecast mode.")
	}
	console.log(attack)

	// add attacker name tag & hp
	let atktag = Tag.create(atkr.name, atkr.control.faction, sprites)
	let atkrhp = Hp.create(atkr.hp, atkr.stats.hp, atkr.control.faction)
	mode.comps.push(atktag)
	mode.comps.push(atkrhp)
	Hp.startFlash(atkrhp, attack.counter ? attack.counter.realdmg : 0)

	// add defender tag & hp
	let deftag = Tag.create(defr.name, defr.control.faction, sprites, { flipped: true })
	let defrhp = Hp.create(defr.hp, defr.stats.hp, defr.control.faction, { flipped: true })
	mode.comps.push(deftag)
	mode.comps.push(defrhp)
	Hp.startFlash(defrhp, attack.realdmg)

	// add vs diamond
	let vs = Vs.create(sprites)
	mode.comps.push(vs)

	// add stat panels
	let wpn = StatPanel.create("wpn", attack, sprites)
	let dmg = StatPanel.create("dmg", attack, sprites, { offset: 1 })
	let hit = StatPanel.create("hit", attack, sprites, { offset: 2 })
	mode.comps.push(wpn)
	mode.comps.push(dmg)
	mode.comps.push(hit)

	// add back button
	let back = Back.create(sprites)
	mode.comps.push(back)

	// add attack range
	let range = Range.create({
		center: atkr.cell,
		radius: Unit.rng(atkr),
		squares: nbrhd(atkr.cell, atkr.wpn.rng)
			.map(cell => ({ cell, type: "attack" }))
	}, sprites)
	mode.comps.push(range)

	// lift piece
	mode.anim = PieceLift.create({ unit: atkr })
	mode.anims.push(mode.anim)

	// center camera
	let midpoint = {
		x: (atkr.cell.x + defr.cell.x) / 2,
		y: (atkr.cell.y + defr.cell.y) / 2
	}
	Camera.center(screen.camera, screen.map, midpoint)
	screen.camera.target.y -= screen.camera.height / 4 - 6
}

export function onexit(mode, screen) {
	let next = screen.nextmode

	// remove piece lift animation
	if (mode.anim && mode.anim.id === "PieceLift") {
		mode.anim.done = true
		// mode.anim = PieceDrop.create({ y: mode.anim.y, unit: mode.unit })
		// mode.anims.push(mode.anim)
	}

	// only pass persistent components if attacking
	if (next.id !== "Attack") return

	// pass persistent components to next mode
	const persist = [ "Vs", "Hp", "Tag" ]
	for (let c = 0; c < mode.comps.length; c++) {
		let comp = mode.comps[c]
		if (persist.includes(comp.id)) {
			mode.comps.splice(c--, 1)
			next.comps.push(comp)
		}
	}
}

export function onrelease(mode, screen, pointer) {
	// TODO: buttons
	// right now you are forced to attack if you enter combat forecast
	if (pointer.mode === "click") {
		mode.commands.push({ type: "attack", unit: mode.attack.source, attack: mode.attack })
	}
}
