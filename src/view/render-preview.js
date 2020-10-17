import * as pixels from "../../lib/pixels"
import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import renderTag from "./render-name-tag"
import renderText from "./render-text"
import renderBox from "./render-box"
import drawOutline from "./style-outline"
import drawShadow from "./style-shadow"
import getGradient from "../helpers/get-gradient"

export default function renderUnitPreview(unit, sprites) {
	let { fonts, palette } = sprites

	// unit name
	let tag = renderTag(unit.name, unit.control.faction, sprites)

	// health bar
	let content = (_ => {
		let content = Canvas.create(68, 29)
		let padx = 2
		let label = sprites.labels.hp
		let value = renderText(unit.hp + "/" + unit.stats.hp, {
			font: fonts.smallcapsRadiant
		})

		// draw hp bar
		let health = Canvas.create(48, 3)
		let width = Math.round((health.canvas.width - 2) * unit.hp / unit.stats.hp)
		let [ start, end ] = getGradient(unit.hp, unit.control.faction, palette)
		let gradient = health.createLinearGradient(0, 1, health.canvas.width - 2, 1)
		gradient.addColorStop(0, rgb(...start))
		gradient.addColorStop(1, rgb(...end))
		health.fillStyle = gradient
		health.fillRect(2, 0, width, 1)
		health.fillRect(1, 1, width, 1)
		health.fillRect(0, 2, width, 1)

		// pre-shadow prep
		content.drawImage(label, padx, 0)
		let labelshadow = Canvas.recolor(content.canvas, palette.taupe)
		content.drawImage(value, padx + label.width + 4, 2)
		let shadow = Canvas.recolor(content.canvas, palette.taupe)

		content.drawImage(shadow, 1, 1)
		content.drawImage(labelshadow, 1, 1)
		content.drawImage(sprites.bars.small, padx + label.width, 0)
		content.drawImage(health.canvas, padx + label.width + 1, 1)
		content.drawImage(label, padx, 0)
		content.drawImage(value, padx + label.width + 4, 2)

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

			const spacing = 21
			let x = 0
			let stat = unit.stats.atk
			let badgetype = unit.type === "mage" ? unit.stats.element : unit.wpn.type
			let badge = sprites.badges[badgetype]
			let value = renderText(stat, {
				font: fonts.numbers,
				color: palette.jet
			})
			content.drawImage(badge, x, 0)
			content.drawImage(value, x + badge.width + 2, 1)

			x += spacing
			stat = unit.stats.hit
			badge = sprites.badges.target
			value = renderText(stat, {
				font: fonts.numbers,
				color: palette.jet
			})
			content.drawImage(badge, x, 0)
			content.drawImage(value, x + badge.width + 2, 1)

			x += spacing
			stat = unit.stats.spd
			badge = sprites.badges.wing
			if (unit.stats.def > unit.stats.spd) {
				stat = unit.stats.def
				badge = sprites.badges.shield
			}
			value = renderText(stat, {
				font: fonts.numbers,
				color: palette.jet
			})
			content.drawImage(badge, x, 0)
			content.drawImage(value, x + badge.width + 2, 1)

			let shadowed = drawShadow(content.canvas, palette.sage)
			stats.drawImage(shadowed, padx, pady)
			return stats.canvas
		})(content.canvas.width - 4)

		// line
		content.fillStyle = rgb(...palette.taupe)
		content.fillRect(2, label.height + 3, content.canvas.width - 4, 1)

		let shadowed = drawShadow(stats, palette.sage)
		content.drawImage(shadowed, 2, label.height + 6)
		return content.canvas
	})()

	let box = renderBox(76, content.height + 8, sprites)
		.getContext("2d")
	let preview = Canvas.create(box.canvas.width, box.canvas.height + 9)
	box.drawImage(content, 4, 6)
	preview.drawImage(box.canvas, 0, 9)

	let x = Math.ceil(74 / 2 - (tag.width - 1) / 2)
	let shadow = Canvas.recolor(tag, palette.taupe)
	preview.drawImage(shadow, x, 1)
	preview.drawImage(tag, x, 0)
	return preview.canvas
}
