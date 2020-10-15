import * as Comps from "./comps"

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

	// add vs component
	let vs = Comps.Vs.create(sprites)
	mode.comps.push(vs)

	// add attacker tag
	let atkr = mode.attacker
	let atktag = Comps.Tag.create(atkr.name, atkr.faction, false, sprites)
	mode.comps.push(atktag)

	// add defender tag
	let defr = mode.defender
	let deftag = Comps.Tag.create(defr.name, defr.faction, true, sprites)
	mode.comps.push(deftag)
}

export function onrelease(mode, screen, pointer) {
	if (pointer.mode === "click") {
		mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}
