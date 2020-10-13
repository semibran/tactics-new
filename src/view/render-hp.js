import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import getGradient from "./hp-gradient"

export function attacker(attacker, sprites) {
	let { bars, palette } = sprites
	let hp = Canvas.copy(bars.left)
	let [ start, end ] = getGradient(attacker, palette, true)
	let gradient = hp.createLinearGradient(2, 0, 53, 0)
	gradient.addColorStop(0, rgb(...start))
	gradient.addColorStop(1, rgb(...end))
	hp.fillStyle = gradient
	hp.fillRect(6, 2, 55, 2)
	hp.fillRect(7, 4, 55, 2)
	hp.fillRect(8, 6, 55, 1)
	return hp.canvas
}

export function defender(defender, sprites) {
	let { bars, palette } = sprites
	let hp = Canvas.copy(bars.right)
	let [ start, end ] = getGradient(defender, palette)
	let gradient = hp.createLinearGradient(0, 0, 53, 0)
	gradient.addColorStop(0, rgb(...start))
	gradient.addColorStop(1, rgb(...end))
	hp.fillStyle = gradient
	hp.fillRect(7, 2, 55, 2)
	hp.fillRect(6, 4, 55, 2)
	hp.fillRect(5, 6, 55, 1)
	return hp.canvas
}
