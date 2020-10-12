import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import renderText from "./render-text"
import drawShadow from "./style-shadow"
import getBadge from "./unit-badge"

export default function renderCombatStats(attacker, defender, sprites) {
	let { fonts, palette, badges } = sprites
	let wpn = renderText("WPN", fonts.smallcapsBold, { shadow: palette.jet })
	let weapon = renderBase(palette)
		.getContext("2d")
	weapon.drawImage(wpn, 21, 3)
	let weapons = Canvas.create(weapon.canvas.width, weapon.canvas.height)
	weapons.drawImage(getBadge(attacker, badges), 4, 1)
	weapons.drawImage(getBadge(defender, badges), 51, 1)
	weapon.drawImage(drawShadow(weapons.canvas, palette.sage), 0, 0)
	return weapon.canvas
}

function renderBase(palette) {
	const width = 64
	const height = 12
	let base = Canvas.create(width, height)
	base.fillStyle = rgb(...palette.sage)
	base.fillRect(1, 0, width - 2, height)
	base.fillRect(0, 1, width, height - 2)
	base.fillStyle = rgb(...palette.cream)
	base.fillRect(1, 0, width - 3, height - 1)
	base.fillRect(0, 1, width - 1, height - 3)
	base.fillStyle = rgb(...palette.jet)
	base.fillRect(17, 0, 30, 12)
	base.fillRect(16, 1, 32, 10)
	base.fillStyle = rgb(...palette.brown)
	base.fillRect(17, 0, 29, 11)
	base.fillRect(16, 1, 31, 9)
	return base.canvas
}
