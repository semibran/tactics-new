import * as Canvas from "../../lib/canvas"
import disasmArrows from "./disasm-arrows"

export default function disasmSelect(images, palette) {
	let select = { glow: {}, ring: {}, cursor: {}, arrows: {} }
	for (let faction in palette.factions) {
		let subpal = palette.factions[faction]

		select.glow[faction] = images["select-glow"]

		let ringbase = images["select-ring"]
		let ringshadow = Canvas.replace(ringbase, palette.white, subpal.light)
		let ring = Canvas.create(ringbase.width, ringbase.height + 1)
		ring.drawImage(ringshadow, 0, 1)
		ring.drawImage(ringbase, 0, 0)
		select.ring[faction] = ring.canvas

		let cursorbase = images["select-cursor"]
		let cursorshadow = Canvas.replace(cursorbase, palette.white, subpal.light)
		let cursor = Canvas.create(cursorbase.width + 1, cursorbase.height + 1)
		cursor.drawImage(cursorshadow, 1, 1)
		cursor.drawImage(cursorbase, 0, 0)
		select.cursor[faction] = cursor.canvas

		select.arrows[faction] = disasmArrows(images, palette, faction)
	}
	return select
}
