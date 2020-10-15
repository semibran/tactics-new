import * as Comps from "./comps"
import * as Unit from "./unit"

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
	let damage = Unit.dmg(attacker, defender)
	let content = [
		[ `${attacker.name} attacks`
	 	, `${defender.name} receives ${damage} damage.`
		]
	]

	let log = Comps.Log.create(content, sprites)
	mode.comps.push(log)
}

export function onrelease(mode, screen, pointer) {
	// TODO: buttons
	if (pointer.mode === "click") {

		mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}
