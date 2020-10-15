import * as Comps from "./comps"

export function create() {
	return {
		id: "Forecast",
		comps: [],
		commands: []
	}
}

export function onenter(mode, screen) {
	let sprites = screen.view.sprites

	console.log("Enter combat forecast")

	// add vs component
	let vs = Comps.Vs.create(sprites)
	mode.comps.push(vs)
}

export function onrelease(mode, screen, pointer) {
	if (pointer.mode === "click") {
		console.log("Exit combat forecast")
		mode.commands.push({ type: "switchMode", mode: "Home" })
	}
}
