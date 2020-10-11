import * as pixels from "../../lib/pixels"
import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import renderTag from "./name-tag"
import renderText from "./text"
import renderBox from "./box"
import drawOutline from "./outline"

export default function renderUnitPreview(unit, sprites) {
	let { fonts, palette } = sprites

	// unit name
	let tag = renderTag(unit.name, sprites)

	// health bar
	let hp = (_ => {
		let hp = Canvas.create(55, 9)
		let label = sprites.labels.hp
		let value = renderText(unit.stats.hp + "/" + unit.stats.hp, fonts.smallcapsRadiant)
		hp.drawImage(label, 0, 0)
		hp.drawImage(value, label.width + 2, 1)
		return hp.canvas
	})()

	let box = renderBox(74, hp.height + 14, sprites)
		.getContext("2d")
	let shadow = Canvas.recolor(hp, palette.taupe)
	let preview = Canvas.create(box.canvas.width, box.canvas.height + 9)
	box.drawImage(shadow, 8, 9)
	box.drawImage(hp, 7, 8)
	preview.drawImage(box.canvas, 0, 9)

	let x = Math.ceil(74 / 2 - (tag.width - 1) / 2)
	shadow = Canvas.recolor(tag, palette.taupe)
	preview.drawImage(shadow, x, 1)
	preview.drawImage(tag, x, 0)
	return preview.canvas
}
