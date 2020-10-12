import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import renderText from "./render-text"
import drawShadow from "./style-shadow"
import getBadge from "./unit-badge"

export function renderWeapon(attacker, defender, sprites) {
	let palette = sprites.palette
	let panel = renderBase("WPN", sprites).getContext("2d")
	let badges = Canvas.create(panel.canvas.width, panel.canvas.height)
	badges.drawImage(getBadge(attacker, sprites.badges), 4, 1)
	badges.drawImage(getBadge(defender, sprites.badges), 51, 1)
	panel.drawImage(drawShadow(badges.canvas, palette.sage), 0, 0)
	return panel.canvas
}

export function renderDamage(attacker, defender, sprites) {
	return renderPanel("DMG", 6, 7, sprites)
}

export function renderHit(attacker, defender, sprites) {
	return renderPanel("HIT", 5, 1, sprites)
}

function renderPanel(text, val1, val2, sprites) {
	const { palette, fonts } = sprites
	let panel = renderBase(text, sprites).getContext("2d")
	let style = {
		font: fonts.smallcapsBold,
		color: palette.jet,
		shadow: palette.sage
	}
	let atkHit = renderText(val1, style)
	let ctrHit = renderText(val2, style)
	panel.drawImage(atkHit, 5, 3)
	panel.drawImage(ctrHit, 52, 3)
	return panel.canvas
}

function renderBase(text, sprites) {
	const { palette, fonts } = sprites
	const width = 64
	const height = 12
	let base = Canvas.create(width, height)
	let label = renderText(text, {
		font: fonts.smallcapsBold,
		shadow: palette.jet
	})
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
	base.drawImage(label, 21, 3)
	return base.canvas
}
