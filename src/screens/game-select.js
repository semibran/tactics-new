import { Comps, addComp, removeComp, Modes, switchMode, panCamera } from "./game"
import findRange from "../game/range"

export function create(data) {
	return {
		id: "Select",
		anims: [],
		unit: data,
		range: null,
		pointer: {
			selecting: false
		}
	}
}

export function onenter(mode, screen) {
	let unit = mode.unit
	let range = Comps.Range.create(findRange(unit, screen.map.data))
	mode.range = range
	addComp(mode.range, screen)
}

export function onexit(mode, screen) {
	removeComp(mode.range, screen)
}

export function onmove(mode, screen, pointer) {
	panCamera(screen, pointer)
}

export function onrelease(mode, screen, pointer) {
	if (pointer.mode === "click") {
		switchMode(screen, Modes.Home)
	}
}
