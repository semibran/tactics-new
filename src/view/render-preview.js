import * as pixels from "../../lib/pixels"
import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import renderTag from "./render-name-tag"
import renderText from "./render-text"
import renderBox from "./render-box"
import drawOutline from "./style-outline"
import drawShadow from "./style-shadow"

export default function renderUnitPreview(unit, sprites) {
	let { fonts, palette } = sprites

	// unit name
	let tag = renderTag(unit.name, unit.faction, sprites)

	// health bar
	let content = (_ => {
		let content = Canvas.create(64, 26)
		let label = sprites.labels.hp
		let value = renderText(unit.stats.hp + "/" + unit.stats.hp, fonts.smallcapsRadiant)

		// color selection
		// start -> green/red based on faction
		// end -> yellow/lime/cyan/blue based on value
		let start = unit.faction === "player"
			? palette.green
			: palette.red
		let end = palette.pink
		if (unit.stats.hp >= 12) {
			end = palette.blue
		} else if (unit.stats.hp >= 10) {
			end = palette.cyan
		} else if (unit.stats.hp >= 8) {
			end = palette.lime
		} else if (unit.stats.hp >= 6) {
			end = palette.yellow
		}

		// draw hp bar
		let health = Canvas.create(42, 3)
		let gradient = health.createLinearGradient(0, 1, health.canvas.width - 2, 1)
		gradient.addColorStop(0, rgb(...start))
		gradient.addColorStop(1, rgb(...end))
		health.fillStyle = gradient
		health.fillRect(2, 0, health.canvas.width - 2, 1)
		health.fillRect(1, 1, health.canvas.width - 2, 1)
		health.fillRect(0, 2, health.canvas.width - 2, 1)

		// pre-shadow prep
		content.drawImage(label, 2, 0)
		content.drawImage(value, 2 + label.width + 6, 2)

		// shadow label + value, then redraw
		let shadow = Canvas.recolor(content.canvas, palette.taupe)
		content.drawImage(sprites.bar, 2 + label.width + 2, 0)
		content.drawImage(shadow, 1, 1)
		content.drawImage(health.canvas, 2 + label.width + 3, 1)
		content.drawImage(label, 2, 0)
		content.drawImage(value, 2 + label.width + 6, 2)

		// line
		content.fillStyle = rgb(...palette.taupe)
		content.fillRect(0, label.height + 3, content.canvas.width, 1)

		// stats
		let stats = (width => {
			let height = 11
			let stats = Canvas.create(width, height)
			stats.fillStyle = rgb(...palette.cream)
			stats.fillRect(1, 0, width - 2, height)
			stats.fillRect(0, 1, width, height - 2)

			let padx = 3
			let pady = 1
			let content = Canvas.create(width - padx * 2, height - pady * 2)

			let x = 0
			let value = renderText(unit.stats.atk, fonts.numbers, { color: palette.jet })
			let badge = sprites.badges.sword
			if (unit.type === "mage") {
				badge = sprites.badges.fire
			} else if (unit.type === "fighter") {
				badge = sprites.badges.axe
			}
			content.drawImage(badge, x, 0)
			content.drawImage(value, x + badge.width + 2, 1)

			x += 21
			value = renderText(unit.stats.hit, fonts.numbers, { color: palette.jet })
			badge = sprites.badges.target
			content.drawImage(badge, x, 0)
			content.drawImage(value, x + badge.width + 2, 1)

			x += 21
			value = renderText(unit.stats.def, fonts.numbers, { color: palette.jet })
			badge = sprites.badges.shield
			content.drawImage(badge, x, 0)
			content.drawImage(value, x + badge.width + 2, 1)

			let shadowed = drawShadow(content.canvas, palette.taupe)
			stats.drawImage(shadowed, padx, pady)
			return stats.canvas
		})(content.canvas.width)
		content.drawImage(stats, 0, label.height + 6)
		return content.canvas
	})()

	let box = renderBox(74, content.height + 12, sprites)
		.getContext("2d")
	let preview = Canvas.create(box.canvas.width, box.canvas.height + 9)
	box.drawImage(content, 5, 7)
	preview.drawImage(box.canvas, 0, 9)

	let x = Math.ceil(74 / 2 - (tag.width - 1) / 2)
	let shadow = Canvas.recolor(tag, palette.taupe)
	preview.drawImage(shadow, x, 1)
	preview.drawImage(tag, x, 0)
	return preview.canvas
}
