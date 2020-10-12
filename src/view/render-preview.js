import * as pixels from "../../lib/pixels"
import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import renderTag from "./render-name-tag"
import renderText from "./render-text"
import renderBox from "./render-box"
import drawOutline from "./style-outline"

export default function renderUnitPreview(unit, sprites) {
	let { fonts, palette } = sprites

	// unit name
	let tag = renderTag(unit.name, unit.faction, sprites)

	// health bar
	let hp = (_ => {
		let hp = Canvas.create(58, 10)
		let label = sprites.labels.hp
		let value = renderText(unit.stats.hp + "/" + unit.stats.hp, fonts.smallcapsRadiant)

		let start = unit.faction === "player"
			? palette.green
			: palette.red
		let end = palette.lime
		let bar = Canvas.create(42, 3)
		let gradient = bar.createLinearGradient(0, 1, bar.canvas.width - 2, 1)
		gradient.addColorStop(0, rgb(...start))
		gradient.addColorStop(1, rgb(...end))

		bar.fillStyle = gradient
		bar.fillRect(2, 0, bar.canvas.width - 2, 1)
		bar.fillRect(1, 1, bar.canvas.width - 2, 1)
		bar.fillRect(0, 2, bar.canvas.width - 2, 1)
		hp.drawImage(label, 0, 0)
		hp.drawImage(value, label.width + 6, 2)

		let shadow = Canvas.recolor(hp.canvas, palette.taupe)
		hp.fillStyle = rgb(...palette.cream)
		hp.fillRect(label.width + 3, bar.canvas.height + 1, bar.canvas.width - 2, 1)
		hp.fillRect(label.width + 3 + bar.canvas.width - 2, bar.canvas.height, 1, 1)
		hp.fillRect(label.width + 3 + bar.canvas.width - 1, bar.canvas.height - 1, 1, 1)
		hp.drawImage(shadow, 1, 1)
		hp.drawImage(bar.canvas, label.width + 3, 1)
		hp.drawImage(label, 0, 0)
		hp.drawImage(value, label.width + 6, 2)

		hp.fillStyle = rgb(...palette.taupe)
		hp.fillRect(label.width + 5, 0, bar.canvas.width - 2, 1)
		hp.fillRect(label.width + 4, 1, 1, 1)
		hp.fillRect(label.width + 3, 2, 1, 1)
		return hp.canvas
	})()

	let box = renderBox(74, hp.height + 12, sprites)
		.getContext("2d")
	let preview = Canvas.create(box.canvas.width, box.canvas.height + 9)
	box.drawImage(hp, 8, 7)
	preview.drawImage(box.canvas, 0, 9)

	let x = Math.ceil(74 / 2 - (tag.width - 1) / 2)
	let shadow = Canvas.recolor(tag, palette.taupe)
	preview.drawImage(shadow, x, 1)
	preview.drawImage(tag, x, 0)
	return preview.canvas
}
