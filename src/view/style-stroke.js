import * as Canvas from "../../lib/canvas"

export default function drawStroke(image, color) {
	let result = Canvas.create(image.width + 2, image.height + 2)
	let base = Canvas.recolor(image, color)
	result.drawImage(base, 0, 1)
	result.drawImage(base, 1, 0)
	result.drawImage(base, 2, 1)
	result.drawImage(base, 1, 2)
	result.drawImage(image, 1, 1)
	return result.canvas
}
