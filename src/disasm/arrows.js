import * as Canvas from "../../lib/canvas"
import extract from "../../lib/img-extract"

export default function disasmArrows(images, palette, faction) {
	let subpal = palette.factions[faction]
	let base = images["select-arrows"]
	let sheet = Canvas.replace(base, palette.black, subpal.light)
	return {
		left:      extract(sheet,  0,  0, 16, 16),
		right:     extract(sheet, 16,  0, 16, 16),
		up:        extract(sheet, 32,  0, 16, 16),
		down:      extract(sheet, 48,  0, 16, 16),
		leftStub:  extract(sheet,  0, 16, 16, 16),
		rightStub: extract(sheet, 16, 16, 16, 16),
		upStub:    extract(sheet, 32, 16, 16, 16),
		downStub:  extract(sheet, 48, 16, 16, 16),
		upleft:    extract(sheet,  0, 32, 16, 16),
		upright:   extract(sheet, 16, 32, 16, 16),
		downleft:  extract(sheet, 32, 32, 16, 16),
		downright: extract(sheet, 48, 32, 16, 16),
		leftright: extract(sheet,  0, 48, 16, 16),
		updown:    extract(sheet, 16, 48, 16, 16)
	}
}
