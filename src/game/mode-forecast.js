import * as Comps from "./comps"
import * as Unit from "./unit"

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
	mode.comps.push(Comps.Hp.create(
		defr.stats.hp, Unit.dmg(atkr, defr),
		defr.faction, sprites,
		true
	))

}

export function onrelease(mode, screen, pointer) {
	if (pointer.mode === "click") {
		mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}
