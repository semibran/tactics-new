import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import getGradient from "../helpers/get-gradient"

export const maxwidth = 54

export function left(value, maxhp, faction, sprites) {
	let { bars, palette } = sprites
	let hp = Canvas.copy(bars.left)
	let pct = value / maxhp
	let width = Math.round(maxwidth * pct)
	let chunk = maxwidth - width
	let x = 5 + chunk
	let [ start, end ] = getGradient(value, faction, palette, true)
	let gradient = hp.createLinearGradient(x, 0, x + width, 0)
	gradient.addColorStop(0, rgb(...start))
	gradient.addColorStop(1, rgb(...end))
	hp.fillStyle = gradient
	hp.fillRect(x + 2, 2, width, 2)
	hp.fillRect(x + 1, 4, width, 2)
	hp.fillRect(x, 6, width, 1)
	return hp.canvas
}

export function leftChunk(damage, value, maxhp, sprites, color) {
	let base = sprites.bars.left
	let chunk = Canvas.create(base.width, base.height)
	let chunkwidth = Math.round(damage / maxhp * maxwidth)
	let chunkx = value / maxhp * maxwidth
	let x = Math.round(maxwidth - chunkwidth - chunkx)
	chunk.fillStyle = color || "white"
	chunk.fillRect(7 + x, 2, chunkwidth, 2)
	chunk.fillRect(6 + x, 4, chunkwidth, 2)
	chunk.fillRect(5 + x, 6, chunkwidth, 1)
	return chunk.canvas
}

export function right(value, maxhp, faction, sprites) {
	let { bars, palette } = sprites
	let hp = Canvas.copy(bars.right)
	let pct = value / maxhp
	let width = Math.round(maxwidth * pct)
	let x = 7
	let [ start, end ] = getGradient(value, faction, palette)
	let gradient = hp.createLinearGradient(x + 2, 0, x + 2 + width, 0)
	gradient.addColorStop(0, rgb(...start))
	gradient.addColorStop(1, rgb(...end))
	hp.fillStyle = gradient
	hp.fillRect(6, 2, width, 2)
	hp.fillRect(7, 4, width, 2)
	hp.fillRect(8, 6, width, 1)
	return hp.canvas
}

export function rightChunk(damage, value, maxhp, sprites, color) {
	let base = sprites.bars.right
	let chunk = Canvas.create(base.width, base.height)
	let chunkwidth = Math.round(damage / maxhp * maxwidth)
	let x = Math.round(value / maxhp * maxwidth)
	chunk.fillStyle = color || "white"
	chunk.fillRect(6 + x, 2, chunkwidth, 2)
	chunk.fillRect(7 + x, 4, chunkwidth, 2)
	chunk.fillRect(8 + x, 6, chunkwidth, 1)
	return chunk.canvas
}
