import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import getGradient from "./hp-gradient"

const maxwidth = 55

export function attacker(unit, damage, sprites) {
	damage = damage || 0
	let { bars, palette } = sprites
	let hp = Canvas.copy(bars.left)
	let pct = (unit.stats.hp - damage) / unit.stats.hp
	let width = Math.round(maxwidth * pct)
	let chunk = maxwidth - width
	let x = 6 + chunk
	let [ start, end ] = getGradient(unit.stats.hp - damage, unit.faction, palette, true)
	let gradient = hp.createLinearGradient(x + 2, 0, x + 2 + (width - 1), 0)
	gradient.addColorStop(0, rgb(...start))
	gradient.addColorStop(1, rgb(...end))
	hp.fillStyle = gradient
	hp.fillRect(x, 2, (width - 1), 2)
	hp.fillRect(x + 1, 4, (width - 1), 2)
	hp.fillRect(x + 2, 6, (width - 1), 1)
	return hp.canvas
}

export function defender(unit, damage, sprites) {
	damage = damage || 0
	let { bars, palette } = sprites
	let hp = Canvas.copy(bars.right)
	let pct = (unit.stats.hp - damage) / unit.stats.hp
	let width = Math.round(maxwidth * pct)
	let x = 5
	let [ start, end ] = getGradient(unit.stats.hp - damage, unit.faction, palette)
	let gradient = hp.createLinearGradient(x, 0, x + width, 0)
	gradient.addColorStop(0, rgb(...start))
	gradient.addColorStop(1, rgb(...end))
	hp.fillStyle = gradient
	hp.fillRect(7, 2, width, 2)
	hp.fillRect(6, 4, width, 2)
	hp.fillRect(5, 6, width, 1)
	return hp.canvas
}
