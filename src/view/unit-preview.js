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
	let hpbar = (_ => {
		let bar = Canvas.create(55, 14)

		let label = renderText("HP", {
			font: fonts.smallcaps,
			color: palette.silver,
			shadow: palette.jet
		})
		let value = renderText(unit.stats.hp, {
			font: fonts.numbers,
			color: palette.white,
			shadow: palette.jet
		})
		let max = renderText("/" + unit.stats.hp, {
			font: fonts.numbers,
			color: palette.silver,
			shadow: palette.jet
		})
		bar.drawImage(label, 1, 1)
		bar.drawImage(value, 1 + label.width + 3, 0)
		bar.drawImage(max, 1 + label.width + 3 + value.width, 0)

		bar.fillStyle = rgb(...palette.jet)
		bar.fillRect(0, value.height + 1, bar.canvas.width - 1, 5)
		bar.fillRect(1, value.height + 2, bar.canvas.width - 1, 5)

		let gradient = bar.createLinearGradient(0, 3, bar.canvas.width - 3, 3)
		gradient.addColorStop(0, rgb(...palette.green))
		gradient.addColorStop(1, rgb(...palette.lime))
		bar.fillStyle = gradient
		bar.fillRect(1, value.height + 2, bar.canvas.width - 3, 3)
		bar.fillStyle = "white"
		bar.fillRect(2, value.height + 2, bar.canvas.width - 5, 1)

		return bar.canvas
	})()

	let box = renderBox(hpbar.width + 12, hpbar.height + 14, sprites)
		.getContext("2d")
	let preview = Canvas.create(box.canvas.width, box.canvas.height + 6)
	box.drawImage(hpbar, 6, 8)
	preview.drawImage(box.canvas, 0, 6)
	preview.drawImage(tag, Math.floor(preview.canvas.width / 2 - tag.width / 2), 0)
	return preview.canvas
}
