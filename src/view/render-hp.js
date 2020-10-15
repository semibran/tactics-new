import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import getGradient from "../helpers/get-gradient"

const maxwidth = 54

export function attacker(maxhp, damage, faction, sprites) {
	damage = damage || 0
	let { bars, palette } = sprites
	let hp = Canvas.copy(bars.left)
	let pct = (maxhp - damage) / maxhp
	let width = Math.round(maxwidth * pct)
	let chunk = maxwidth - (width + 1)
	let x = 7 + chunk
	let [ start, end ] = getGradient(maxhp - damage, faction, palette, true)
	let gradient = hp.createLinearGradient(x + 2, 0, x + 2 + width, 0)
	gradient.addColorStop(0, rgb(...start))
	gradient.addColorStop(1, rgb(...end))
	hp.fillStyle = gradient
	hp.fillRect(x, 2, width, 2)
	hp.fillRect(x + 1, 4, width, 2)
	hp.fillRect(x + 2, 6, width, 1)
	return hp.canvas
}

export function attackerChunk(maxhp, damage, sprites) {
	let base = sprites.bars.left
	let chunk = Canvas.create(base.width, base.height)
	let pct = (maxhp - damage) / maxhp
	let width = maxwidth - Math.round(maxwidth * pct)
	chunk.fillStyle = "white"
	chunk.fillRect(6, 2, width, 2)
	chunk.fillRect(7, 4, width, 2)
	chunk.fillRect(8, 6, width, 1)
	return chunk.canvas
}

export function defender(maxhp, damage, faction, sprites) {
	damage = damage || 0
	let { bars, palette } = sprites
	let hp = Canvas.copy(bars.right)
	let pct = (maxhp - damage) / maxhp
	let width = Math.round(maxwidth * pct)
	let x = 5
	let [ start, end ] = getGradient(maxhp - damage, faction, palette)
	let gradient = hp.createLinearGradient(x, 0, x + width, 0)
	gradient.addColorStop(0, rgb(...start))
	gradient.addColorStop(1, rgb(...end))
	hp.fillStyle = gradient
	hp.fillRect(7, 2, width, 2)
	hp.fillRect(6, 4, width, 2)
	hp.fillRect(5, 6, width, 1)
	return hp.canvas
}

export function defenderChunk(maxhp, damage, sprites) {
	let base = sprites.bars.right
	let chunk = Canvas.create(base.width, base.height)
	let pct = (maxhp - damage) / maxhp
	let offset = Math.round(maxwidth * pct)
	let width = maxwidth - offset
	chunk.fillStyle = "white"
	chunk.fillRect(7 + offset, 2, width, 2)
	chunk.fillRect(6 + offset, 4, width, 2)
	chunk.fillRect(5 + offset, 6, width, 1)
	return chunk.canvas
}
