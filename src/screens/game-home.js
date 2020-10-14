import { Modes, switchMode, panCamera } from "./game"
import * as Map from "../game/map"
import getCell from "../helpers/get-cell"

export function create() {
	return {
		id: "Home",
		anims: [],
		pointer: {
			unit: null // unit
		}
	}
}

export function exit(mode, screen) {

}

export function onpress(mode, screen) {

}

export function onmove(mode, screen, pointer) {
	panCamera(screen, pointer)
}

export function onrelease(mode, screen, pointer) {
	if (pointer.mode === "click") {
		let cell = getCell(pointer.pos, screen.map, screen.camera)
		let unit = Map.unitAt(screen.map.data, cell)
		if (unit) {
			switchMode(screen, Modes.Select, unit)
		}
	}
}
