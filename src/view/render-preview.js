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
	let content = (_ => {
		let content = Canvas.create(60, 10)
		let label = sprites.labels.hp
		let value = renderText(unit.stats.hp + "/" + unit.stats.hp, fonts.smallcapsRadiant)

		let start = unit.faction === "player"
			? palette.green
			: palette.red
		let end = palette.lime
		let health = Canvas.create(42, 3)
		let gradient = health.createLinearGradient(0, 1, health.canvas.width - 2, 1)
		gradient.addColorStop(0, rgb(...start))
		gradient.addColorStop(1, rgb(...end))

		health.fillStyle = gradient
		health.fillRect(2, 0, health.canvas.width - 2, 1)
		health.fillRect(1, 1, health.canvas.width - 2, 1)
		health.fillRect(0, 2, health.canvas.width - 2, 1)
		content.drawImage(label, 0, 0)
		content.drawImage(value, label.width + 6, 2)

		let shadow = Canvas.recolor(content.canvas, palette.taupe)
		content.drawImage(sprites.bar, label.width + 2, 0)
		content.drawImage(shadow, 1, 1)
		content.drawImage(health.canvas, label.width + 3, 1)
		content.drawImage(label, 0, 0)
		content.drawImage(value, label.width + 6, 2)
		return content.canvas
	})()

	let box = renderBox(74, content.height + 12, sprites)
		.getContext("2d")
	let preview = Canvas.create(box.canvas.width, box.canvas.height + 9)
	box.drawImage(content, 7, 7)
	preview.drawImage(box.canvas, 0, 9)

	let x = Math.ceil(74 / 2 - (tag.width - 1) / 2)
	let shadow = Canvas.recolor(tag, palette.taupe)
	preview.drawImage(shadow, x, 1)
	preview.drawImage(tag, x, 0)
	return preview.canvas
}
