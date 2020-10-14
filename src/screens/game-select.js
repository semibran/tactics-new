import { Comps, Modes, switchMode, panCamera } from "./game"
import findRange from "../game/range"

export function create(data) {
	return {
		id: "Select",
		anims: [],
		unit: data,
		pointer: {
			selecting: false
		},
		cache: {
			range: null
		}
	}
}

export function enter(mode, screen) {
	let unit = mode.unit
	let range = Comps.Range.create(findRange(unit, screen.map.data))
	Comps.Range.add(range, screen)
	// let preview = renderPreview(unit, sprites)
	// let expand = Anims.RangeExpand.create(range)
	// let enter = Anims.PreviewEnter.create()
	// let lift = Anims.PieceLift.create()
}

export function exit() {

}

export function onmove(mode, screen, pointer) {
	panCamera(screen, pointer)
}

export function onrelease(mode, screen, pointer) {
	if (pointer.mode === "click") {

	}
}

export function render(mode, view) {
	// queue unit previews
	// queue unit mirage
	// queue arrow
}
