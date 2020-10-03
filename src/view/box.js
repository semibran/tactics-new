import Canvas from "../../lib/canvas"

export default function renderBox(width, height) {
	let box = Canvas(width, height)
	box.fillStyle = "white"
	box.fillRect(1, 0, width - 2, height)
	box.fillRect(0, 1, width, height - 2)
	return box.canvas
}
