import { Modes, switchMode, panCamera } from "./game"
import * as Map from "../game/map"
import getCell from "../helpers/get-cell"

export function create() {
	return {
		id: "Home",
		unit: null
	}
}

export function onpress(mode, screen, pointer) {
	let cell = getCell(pointer.pos, screen.map, screen.camera)
	let unit = Map.unitAt(screen.map.data, cell)
	mode.unit = unit
}

export function onmove(mode, screen, pointer) {
	panCamera(screen, pointer)
}

export function onrelease(mode, screen, pointer) {
	if (mode.unit && pointer.mode === "click") {
		switchMode(screen, Modes.Select, mode.unit)
	}
}
