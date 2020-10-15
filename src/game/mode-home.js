import * as Map from "./map"
import * as Camera from "./camera"
import getCell from "../helpers/get-cell"

export function create() {
	return {
		id: "Home",
		comps: [],
		commands: [],
		press: null
	}
}

export function onpress(mode, screen, pointer) {
	let cell = getCell(pointer.pos, screen.map, screen.camera)
	let unit = Map.unitAt(screen.map, cell)
	if (unit) {
		mode.press = {
			unit: unit,
			time: screen.time
		}
	}
}

export function onmove(mode, screen, pointer) {
	if (mode.press && pointer.mode !== "click") {
		mode.press = null
	}
	Camera.pan(screen.camera, pointer)
}

export function onrelease(mode, screen, pointer) {
	if (mode.press && pointer.mode === "click") {
		select(mode, mode.press.unit)
	}
	mode.press = null
}

export function onupdate(mode, screen) {
	let press = mode.press
	if (press && press.time && screen.time - press.time >= 20) {
		select(mode, mode.press.unit, true)
	}
}

function select(mode, unit, held) {
	mode.commands.push({
		type: "switchMode",
		mode: "Select",
		data: {
			unit: unit,
			held: !!held
		}
	})
}
