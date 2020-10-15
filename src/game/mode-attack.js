import * as Comps from "./comps"

export function create(data) {
	return {
		id: "Attack",
		attacker: data.attacker,
		defender: data.defender,
		log: null,
		comps: [],
		commands: []
	}
}

export function onenter(mode, screen) {
	let sprites = screen.sprites
	let attacker = mode.attacker
	let defender = mode.defender
	let log = Comps.Log.create([ attacker.name + " attacks " + defender.name ], sprites)
	mode.comps.push(log)
}

export function onrelease(mode, screen, pointer) {
	// TODO: buttons
	if (pointer.mode === "click") {

		mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}
