import rgb from "../../lib/rgb"
import * as Canvas from "../../lib/canvas"
import * as Unit from "../game/unit"
import renderText from "./render-text"
import drawShadow from "./style-shadow"

export function renderWpn(atkwpn, ctrwpn, sprites) {
	let palette = sprites.palette
	let panel = renderBase("WPN", sprites).getContext("2d")
	let badges = Canvas.create(panel.canvas.width, panel.canvas.height)
	badges.drawImage(sprites.badges[atkwpn], 4, 1)
	badges.drawImage(sprites.badges[ctrwpn], 51, 1)
	panel.drawImage(drawShadow(badges.canvas, palette.sage), 0, 0)
	return panel.canvas
}

export function renderDmg(atkdmg, ctrdmg, sprites) {
	return renderPanel("DMG", atkdmg, ctrdmg, sprites)
}

export function renderHit(atkhit, ctrhit, sprites) {
	return renderPanel("HIT", atkhit, ctrhit, sprites)
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
