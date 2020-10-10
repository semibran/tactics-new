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
		let bar = Canvas.create(60, 12)

		let label = renderText("HP", {
			font: fonts.smallcaps,
			color: palette.silver,
			shadow: palette.jet
		})
		let value = renderText(unit.stats.hp, {
			font: fonts.smallcapsBold,
			color: palette.white,
			shadow: palette.jet
		})
		let max = renderText("/" + unit.stats.hp, {
			font: fonts.smallcapsBold,
			color: palette.silver,
			shadow: palette.jet
		})
		bar.drawImage(label, 1, 0)
		bar.drawImage(value, 1 + label.width + 2, 0)
		bar.drawImage(max, 1 + label.width + 2 + value.width, 0)

		bar.fillStyle = rgb(...palette.jet)
		bar.fillRect(0, label.height + 1, bar.canvas.width, 5)

		let gradient = bar.createLinearGradient(0, 3, bar.canvas.width - 2, 3)
		gradient.addColorStop(0, rgb(...palette.green))
		gradient.addColorStop(1, rgb(...palette.lime))
		bar.fillStyle = gradient
		bar.fillRect(1, label.height + 2, bar.canvas.width - 2, 3)
		bar.fillStyle = "white"
		bar.fillRect(2, label.height + 2, bar.canvas.width - 4, 1)

		return bar.canvas
	})()

	let box = renderBox(hpbar.width + 13, hpbar.height + 15, sprites)
		.getContext("2d")
	let preview = Canvas.create(box.canvas.width, box.canvas.height + 7)
	box.drawImage(hpbar, 6, 9)
	preview.drawImage(box.canvas, 0, 7)
	preview.drawImage(tag, 7, 0)
	preview.fillStyle = rgb(...palette.jet)
	preview.fillRect(6, 7, 1, 2)
	return preview.canvas
}
