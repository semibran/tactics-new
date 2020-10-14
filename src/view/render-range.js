import * as Canvas from "../../lib/canvas"

export default function renderRange(range, sprites) {
	let tilewidth = sprites.squares.move.width
	let tileheight = sprites.squares.move.height
	let right = range.center.x + range.radius
	let bottom = range.center.y + range.radius
	let width = (right + 1) * tilewidth
	let height = (bottom + 1) * tileheight
	let result = Canvas.create(width, height)
	for (let square of range.squares) {
		let x = square.cell.x * tilewidth
		let y = square.cell.y * tileheight
		let sprite = sprites.squares.move
		if (square.type === "attack") {
			sprite = sprites.squares.attack
		}
		result.drawImage(sprite, x, y)
	}
	return result.canvas
}
