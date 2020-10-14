import { Comps, Modes, switchMode, panCamera } from "./game"
import * as PieceLift from "../anims/piece-lift"
import * as PieceDrop from "../anims/piece-drop"
import findRange from "../game/range"

export function create(data) {
	return {
		id: "Select",
		unit: data,
		range: null,
		preview: null,
		anim: null,
		pointer: {
			selecting: false
		}
	}
}

export function onenter(mode, screen) {
	// add range component
	let rangedata = findRange(mode.unit, screen.map.data)
	mode.range = Comps.Range.create(rangedata)
	Comps.Range.enter(mode.range, screen)
	screen.comps.push(mode.range)

	// add preview component
	mode.preview = Comps.Preview.create(mode.unit)
	Comps.Preview.enter(mode.preview, screen)
	screen.comps.push(mode.preview)

	// add piece lift animation
	mode.anim = PieceLift.create()
	screen.anims.push(mode.anim)
}

export function onexit(mode, screen) {
	// close components
	Comps.Range.exit(mode.range, screen)
	Comps.Preview.exit(mode.preview, screen)

	// remove piece lift animation
	mode.anim.done = true
	mode.anim = PieceDrop.create(mode.anim.y)
	screen.anims.push(mode.anim)
}

export function onmove(mode, screen, pointer) {
	panCamera(screen, pointer)
}

export function onrelease(mode, screen, pointer) {
	if (pointer.mode === "click") {
		switchMode(screen, Modes.Home)
	}
}
