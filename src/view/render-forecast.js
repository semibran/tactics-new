import rgb from "../../lib/rgb"
import * as Canvas from "../../lib/canvas"
import * as Unit from "../game/unit"
import renderText from "./render-text"
import drawShadow from "./style-shadow"
import getBadge from "./unit-badge"

export function renderWpn(attacker, defender, sprites) {
	let palette = sprites.palette
	let panel = renderBase("WPN", sprites).getContext("2d")
	let badges = Canvas.create(panel.canvas.width, panel.canvas.height)
	badges.drawImage(getBadge(attacker, sprites.badges), 4, 1)
	badges.drawImage(getBadge(defender, sprites.badges), 51, 1)
	panel.drawImage(drawShadow(badges.canvas, palette.sage), 0, 0)
	return panel.canvas
}

export function renderDmg(attacker, defender, sprites) {
	let dmg1 = Unit.dmg(attacker, defender)
	let dmg2 = Unit.dmg(defender, attacker)
	if (dmg1 === null) {
		dmg1 = "-"
	}
	if (dmg2 === null || dmg1 >= defender.hp) {
		dmg2 = "-"
	}
	return renderPanel("DMG", dmg1, dmg2, sprites)
}

export function renderHit(attacker, defender, sprites) {
	let hit1 = Unit.hit(attacker, defender)
	let hit2 = Unit.hit(defender, attacker)
	if (hit1 === null || hit1 < 0) {
		hit1 = "-"
	}
	if (hit2 === null || hit2 < 0 || Unit.dmg(attacker, defender) >= defender.hp) {
		hit2 = "-"
	}
	return renderPanel("HIT", hit1, hit2, sprites)
}

function renderPanel(text, val1, val2, sprites) {
	const { palette, fonts } = sprites
	let panel = renderBase(text, sprites).getContext("2d")
	let style = {
		font: fonts.smallcapsBold,
		color: palette.jet,
		shadow: palette.sage
	}
	let atkVal = renderText(val1, style)
	let ctrVal = renderText(val2, style)
	panel.drawImage(atkVal, 8 - Math.floor(atkVal.width / 2), 3)
	panel.drawImage(ctrVal, 55 - Math.floor(ctrVal.width / 2), 3)
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
