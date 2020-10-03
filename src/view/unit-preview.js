import * as pixels from "../../lib/pixels"
import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import renderText from "./text"
import renderBox from "./box"
import drawOutline from "./outline"

export default function renderUnitPreview(unit, sprites) {
	let { fonts, palette } = sprites

	// unit name
	let name = renderText(unit.name, {
		font: sprites.fonts.serif,
		color: palette.white,
		stroke: palette.jet
	})

	// type/faction badge
	let badge = (_ => {
		let icon = sprites.badges[unit.type]
		let orb = sprites.badges[unit.faction]
		let result = Canvas.create(icon.width + 2, icon.height + 1)
		if (unit.type === "mage") {
			result.drawImage(icon, 1, 1)
			result.drawImage(orb, 0, 0)
		} else {
			result.drawImage(icon, 1, 1)
			result.drawImage(orb, icon.width - orb.width + 2, 0)
		}
		return result.canvas
	})()

	// health bar
	let hpbar = (_ => {
		let bar = Canvas.create(68, 11)
		let subpal = palette.factions[unit.faction]
		bar.fillStyle = rgb(...palette.jet)
		bar.fillRect(0, 0, 68, 6)

		let gradient = bar.createLinearGradient(0, 3, 68, 3)
		gradient.addColorStop(0, rgb(...subpal.normal))
		gradient.addColorStop(1, rgb(...subpal.light))
		bar.fillStyle = gradient
		bar.fillRect(1, 1, 66, 4)

		let label = renderText("HP", {
			font: fonts.smallcaps,
			color: palette.white,
			stroke: palette.jet
		})
		let value = renderText(unit.hp, {
			font: fonts.standard,
			color: palette.white,
			stroke: palette.jet
		})
		let max = renderText("/" + unit.hp, {
			font: fonts.smallcapsBold,
			color: palette.white,
			stroke: palette.jet
		})
		bar.drawImage(label, 3, 2)
		bar.drawImage(value, 3 + label.width + 2, 2)
		bar.drawImage(max, 3 + label.width + 2 + value.width, 2)
		return bar.canvas
	})()

	// atk/def
	let stats = (_ => {
		let style = {
			font: fonts.numbers,
			color: palette.white,
			stroke: palette.jet
		}
		let atk = renderText(unit.atk, style)
		let def = renderText(unit.def, style)
		let sword = drawOutline(sprites.icons.small.sword, palette.jet)
		let shield = drawOutline(sprites.icons.small.shield, palette.jet)
		let width = sword.width + atk.width + 3 + shield.width + def.width
		let stats = Canvas.create(width, 8)
		stats.drawImage(sword, 0, 0)
		stats.drawImage(atk, sword.width, 0)
		stats.drawImage(shield, sword.width + atk.width + 2, 0)
		stats.drawImage(def, sword.width + atk.width + 2 + shield.width, 0)
		return stats.canvas
	})()

	// element badge
	let element = (_ => {
		let icon = sprites.icons[unit.element]
		let element = Canvas.create(icon.width + 6, icon.height)
		element.fillStyle = rgb(...palette.cyan)
		element.fillRect(0, 2, icon.width + 6, icon.height - 4)
		element.fillRect(1, 1, icon.width + 4, icon.height - 2)
		element.fillStyle = "white"
		element.fillRect(1, 2, icon.width + 4, icon.height - 4)
		element.drawImage(icon, 3, 0)
		return element.canvas
	})()

	let width = hpbar.width + 1
	let height = badge.height + 2 + hpbar.height + 3 + stats.height + 1
	let content = Canvas.create(width, height)
	content.drawImage(badge, 0, 0)
	content.drawImage(name, badge.width + 2, 0)
	content.drawImage(hpbar, 1, badge.height + 2)
	content.drawImage(stats, 4, badge.height + 2 + hpbar.height + 3)
	content.drawImage(element, width - element.width, badge.height + 3 + hpbar.height + 1)

	let shadow = Canvas.recolor(content.canvas, palette.cyan)
	let box = renderBox(content.canvas.width + 8, content.canvas.height + 5)
		.getContext("2d")
	box.drawImage(shadow, 3, 3)
	box.drawImage(content.canvas, 2, 2)
	return box.canvas
}
