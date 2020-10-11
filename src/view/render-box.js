import Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"

export default function renderBox(width, height, { palette }) {
	let box = Canvas(width + 2, height + 2)
	box.fillStyle = rgb(...palette.brown)
	box.fillRect(0, 1, width + 2, height)
	box.fillRect(1, 0, width, height + 2)
	box.fillStyle = rgb(...palette.taupe)
	box.fillRect(0, 1, width + 1, height - 1)
	box.fillRect(1, 0, width - 1, height + 1)
	box.fillStyle = rgb(...palette.beige)
	box.fillRect(0, 1, width, height - 2)
	box.fillRect(1, 0, width - 2, height)
	box.fillStyle = rgb(...palette.taupe)
	box.fillRect(2, 1, width - 4, height - 2)
	box.fillRect(1, 2, width - 2, height - 4)
	box.fillStyle = rgb(...palette.beige)
	box.fillRect(2, 2, width - 4, height - 4)
	return box.canvas
}
