import * as Comps from "./comps"
import * as Unit from "./unit"
import * as Camera from "./camera"
import * as Cell from "../../lib/cell"
import * as PieceLift from "../anims/piece-lift"
import * as PieceDrop from "../anims/piece-drop"

export function create(data) {
	return {
		id: "Forecast",
		unit: data.unit,
		target: data.target,
		comps: [],
		commands: [],
		anim: null
	}
}

export function onenter(mode, screen) {
	let sprites = screen.view.sprites
	let atkr = mode.unit
	let defr = mode.target

	// center camera
	let midpoint = {
		x: (atkr.cell.x + defr.cell.x) / 2,
		y: (atkr.cell.y + defr.cell.y) / 2
	}
	Camera.center(screen.camera, screen.map, midpoint)
	screen.camera.target.y -= screen.camera.height / 4 - 6

	// add attacker name tag
	// add attacker hp
	let atktag = Comps.Tag.create(atkr.name, atkr.faction, sprites)
	let atkrhp = Comps.Hp.create(
		atkr.hp, atkr.stats.hp,
		atkr.faction
	)
	mode.comps.push(atktag)
	mode.comps.push(atkrhp)
	Comps.Hp.startFlash(atkrhp, Unit.dmg(defr, atkr))

	// add defender tag
	// add defender hp
	let deftag = Comps.Tag.create(defr.name, defr.faction, sprites, { flipped: true })
	let defrhp = Comps.Hp.create(
		defr.hp, defr.stats.hp,
		defr.faction, { flipped: true }
	)
	mode.comps.push(deftag)
	mode.comps.push(defrhp)
	Comps.Hp.startFlash(defrhp, Unit.dmg(atkr, defr))

	// add stat panels
	let wpn = Comps.StatPanel.create("wpn", atkr, defr, sprites)
	let dmg = Comps.StatPanel.create("dmg", atkr, defr, sprites, { offset: 1 })
	let hit = Comps.StatPanel.create("hit", atkr, defr, sprites, { offset: 2 })
	mode.comps.push(wpn)
	mode.comps.push(dmg)
	mode.comps.push(hit)

	// add vs diamond
	let vs = Comps.Vs.create(sprites)
	mode.comps.push(vs)

	// add attack range
	let range = Comps.Range.create({
		center: atkr.cell,
		radius: Unit.rng(atkr),
		squares: Cell.neighborhood(atkr.cell, Unit.rng(atkr))
			.map(cell => ({ cell, type: "attack" }))
	}, sprites)
	mode.comps.push(range)

	// lift piece
	mode.anim = PieceLift.create()
}

export function onexit(mode, screen) {
	// remove piece lift animation
	if (mode.anim && mode.anim.id === "PieceLift") {
		mode.anim.done = true
		mode.anim = PieceDrop.create(mode.anim.y)
	}
}

export function onrelease(mode, screen, pointer) {
	// TODO: buttons
	// right now you are forced to attack if you enter combat forecast
	if (pointer.mode === "click") {
		mode.commands.push({
			type: "switchMode",
			mode: "Attack",
			data: {
				unit: mode.unit,
				target: mode.target
			}
		})
	}
}
