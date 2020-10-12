import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import renderText from "./render-text"
import drawShadow from "./style-shadow"
import getBadge from "./unit-badge"

export function renderWeapon(attacker, defender, sprites) {
	let { fonts, palette } = sprites
	let wpn = renderText("WPN", fonts.smallcapsBold, { shadow: palette.jet })
	let panel = renderBase(palette)
		.getContext("2d")
	panel.drawImage(wpn, 21, 3)
	let badges = Canvas.create(panel.canvas.width, panel.canvas.height)
	badges.drawImage(getBadge(attacker, sprites.badges), 4, 1)
	badges.drawImage(getBadge(defender, sprites.badges), 51, 1)
	panel.drawImage(drawShadow(badges.canvas, palette.sage), 0, 0)
	return panel.canvas
}

export function renderDamage(attacker, defender, sprites) {
	let { fonts, palette } = sprites
	let dmg = renderText("DMG", fonts.smallcapsBold, { shadow: palette.jet })
	let panel = renderBase(palette)
		.getContext("2d")
	panel.drawImage(dmg, 21, 3)
	let atkDmg = renderText("6", fonts.smallcapsBold, {
		shadow: palette.sage,
		color: palette.jet
	})
	let ctrDmg = renderText("7", fonts.smallcapsBold, {
		shadow: palette.sage,
		color: palette.jet
	})
	panel.drawImage(atkDmg, 5, 3)
	panel.drawImage(ctrDmg, 52, 3)
	return panel.canvas
}

export function renderHit(attacker, defender, sprites) {
	let { fonts, palette } = sprites
	let hit = renderText("HIT", fonts.smallcapsBold, { shadow: palette.jet })
	let panel = renderBase(palette)
		.getContext("2d")
	panel.drawImage(hit, 21, 3)
	let atkHit = renderText("5", fonts.smallcapsBold, {
		shadow: palette.sage,
		color: palette.jet
	})
	let ctrHit = renderText("1", fonts.smallcapsBold, {
		shadow: palette.sage,
		color: palette.jet
	})
	panel.drawImage(atkHit, 5, 3)
	panel.drawImage(ctrHit, 52, 3)
	return panel.canvas
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
