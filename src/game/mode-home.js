import { Modes, switchMode, panCamera } from "."
import * as Map from "./map"
import getCell from "../helpers/get-cell"

export function create() {
	return {
		id: "Home",
		press: null
	}
}

export function onpress(mode, screen, pointer) {
	let cell = getCell(pointer.pos, screen.map, screen.camera)
	let unit = Map.unitAt(screen.map.data, cell)
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
	panCamera(screen, pointer)
}

export function onrelease(mode, screen, pointer) {
	if (mode.press && pointer.mode === "click") {
		select(mode.press.unit, screen)
	}
	mode.press = null
}

export function onupdate(mode, screen) {
	let press = mode.press
	if (press && press.time && screen.time - press.time >= 20) {
		select(press.unit, screen, true)
	}
}

function select(unit, screen, held) {
	switchMode(screen, Modes.Select, {
		unit: unit,
		held: !!held
	})
}
