import * as Comps from "./comps"

export function create() {
	return {
		id: "Actions",
		events: []
	}
}

export function onenter(mode, screen) {
	let sprites = screen.sprites
	let select = screen.select
	if (!select) {
		throw new Error("Failed to create actions menu: no selected unit defined")
	}

	// if piece has moved
	let move = null
	if (select.moved) {
		move = Comps.Button.create("undo", { mode: "Actions", offset: 0, onclick() {
			mode.events.push([ "undo" ])
		}})
	} {
		move = Comps.Button.create("move", { mode: "Actions", offset: 0, onclick() {
			mode.events.push([ "goto", "Select" ])
		}})
	}

	// if piece has potential targets
	if (select.targets.length) {
		// create attack button
		Comps.Button.create("attack", { mode: "Actions", offset: 1, onclick() {
			mode.events.push([ "forecast" ])
		}})
	} else {
		// create attack button, but make it greyed out
		Comps.Button.create("attack", { mode: "Actions", offset: 1 })
	}

	// create greyed out stats button
	Comps.Button.create("stats", { mode: "Actions", offset: 2 })

	// create wait button
	Comps.Button.create("wait", { mode: "Actions", offset: 3, onclick() {
		mode.events.push([ "endTurn" ])
	}})
}
