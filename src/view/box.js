import Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"

export default function renderBox(width, height, { palette }) {
	let box = Canvas(width, height)
	box.fillStyle = rgb(...palette.jet)
	box.fillRect(1, 0, width - 2, height)
	box.fillRect(0, 1, width, height - 2)
	box.fillStyle = rgb(...palette.silver)
	box.fillRect(1, 0, width - 3, height - 1)
	box.fillRect(0, 1, width - 1, height - 3)
	box.fillStyle = rgb(...palette.jet)
	box.fillRect(2, 2, width - 5, height - 5)
	box.fillStyle = rgb(...palette.coal)
	box.fillRect(4, 4, width - 8, height - 8)
	box.fillStyle = rgb(...palette.white)
	box.fillRect(1, 1, 1, 1)
	box.fillRect(width - 3, 1, 1, 1)
	box.fillRect(2, 0, width - 5, 1)
	box.fillRect(1, height - 4, 1, 1)
	box.fillRect(width - 3, height - 4, 1, 1)
	box.fillRect(2, height - 3, width - 5, 1)
	return box.canvas
}
