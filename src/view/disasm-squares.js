import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"

export default function disasmSquares(palette) {
	const opacity = 0.25
	const tilesize = 16

	let move = Canvas.create(tilesize, tilesize)
	move.globalAlpha = opacity
	move.fillStyle = "blue"
	move.fillRect(0, 0, tilesize - 1, tilesize - 1)

	let attack = Canvas.create(tilesize, tilesize)
	attack.globalAlpha = opacity
	attack.fillStyle = "red"
	attack.fillRect(0, 0, tilesize - 1, tilesize - 1)

	return { move: move.canvas, attack: attack.canvas }
}
