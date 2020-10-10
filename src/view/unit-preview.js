import * as pixels from "../../lib/pixels"
import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import renderUnitTag from "./unit-tag"
import renderText from "./text"
import renderBox from "./box"
import drawOutline from "./outline"

export default function renderUnitPreview(unit, sprites) {
	let { fonts, palette } = sprites

	// unit name
	let tag = renderUnitTag(unit, sprites)

	// health bar
	let hpbar = (_ => {
		let bar = Canvas.create(68, 15)
		let subpal = palette.factions[unit.faction]
		bar.fillStyle = rgb(...palette.jet)
		bar.fillRect(0, 0, 68, 5)

		let gradient = bar.createLinearGradient(0, 3, 68, 3)
		gradient.addColorStop(0, rgb(...palette.green))
		gradient.addColorStop(1, rgb(...palette.lime))
		bar.fillStyle = gradient
		bar.fillRect(1, 1, 66, 3)
		bar.fillStyle = "white"
		bar.fillRect(2, 1, 64, 1)

		let label = renderText("HP", {
			font: fonts.smallcaps,
			color: palette.silver,
			stroke: palette.jet
		})
		let value = renderText(unit.stats.hp, {
			font: fonts.smallcapsBold,
			color: palette.white,
			stroke: palette.jet
		})
		let max = renderText("/" + unit.stats.hp, {
			font: fonts.smallcapsBold,
			color: palette.silver,
			stroke: palette.jet
		})
		bar.drawImage(label, 0, 6)
		bar.drawImage(value, 0 + label.width + 2, 6)
		bar.drawImage(max, 0 + label.width + 2 + value.width - 1, 6)
		return bar.canvas
	})()

	let width = hpbar.width + 1
	let height = tag.height + 1 + hpbar.height
	let content = Canvas.create(width, height)
	content.drawImage(tag, 0, 0)
	content.drawImage(hpbar, 0, tag.height + 1)

	let shadow = Canvas.recolor(content.canvas, palette.cyan)
	let box = Canvas.create(content.canvas.width + 6, content.canvas.height + 5)
	box.drawImage(content.canvas, 2, 2)
	return box.canvas
}
