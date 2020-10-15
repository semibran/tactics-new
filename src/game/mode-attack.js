import * as Comps from "./comps"

export function create(data) {
	return {
		id: "Attack",
		attacker: data.attacker,
		defender: data.defender,
		comps: [],
		commands: []
	}
}

export function onenter(mode, screen) {
	let sprites = screen.sprites
	mode.comps.push(Comps.Log.create(sprites))
}

export function onrelease(mode, screen, pointer) {
	// TODO: buttons
	if (pointer.mode === "click") {
		mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}
