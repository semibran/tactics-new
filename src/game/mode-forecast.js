import * as Comps from "./comps"
import * as Unit from "./unit"
import * as Camera from "./camera"

export function create(data) {
	return {
		id: "Forecast",
		attacker: data.attacker,
		defender: data.defender,
		comps: [],
		commands: []
	}
}

export function onenter(mode, screen) {
	let sprites = screen.view.sprites
	let atkr = mode.attacker
	let defr = mode.defender

	// center camera
	let midpoint = {
		x: (atkr.cell.x + defr.cell.x) / 2,
		y: (atkr.cell.y + defr.cell.y) / 2
	}
	Camera.center(screen.camera, screen.map, midpoint)
	screen.camera.target.y -= screen.camera.height / 4 - 6

	// add vs component
	let vs = Comps.Vs.create(sprites)
	mode.comps.push(vs)

	// add attacker name tag
	let atktag = Comps.Tag.create(atkr.name, atkr.faction, sprites)
	mode.comps.push(atktag)

	// add attacker hp
	let atkrhp = Comps.Hp.create(atkr.stats.hp, Unit.dmg(defr, atkr), atkr.faction, sprites)
	mode.comps.push(atkrhp)

	// add defender tag
	let deftag = Comps.Tag.create(defr.name, defr.faction, sprites, true)
	mode.comps.push(deftag)

	// add defender hp
	let defrhp = Comps.Hp.create(
		defr.stats.hp, Unit.dmg(atkr, defr),
		defr.faction, sprites,
		true
	)
	mode.comps.push(defrhp)

	let wpn = Comps.StatPanel.create("wpn", atkr, defr, sprites)
	mode.comps.push(wpn)

	let dmg = Comps.StatPanel.create("dmg", atkr, defr, sprites, { offset: 1 })
	mode.comps.push(dmg)

	let hit = Comps.StatPanel.create("hit", atkr, defr, sprites, { offset: 2 })
	mode.comps.push(hit)
}

export function onrelease(mode, screen, pointer) {
	if (pointer.mode === "click") {
		mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}
