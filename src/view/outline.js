import * as Canvas from "../../lib/canvas"

export default function drawOutline(image, color) {
	let result = Canvas.create(image.width + 2, image.height + 2)
	let base = Canvas.recolor(image, color)
	for (let y = 0; y < 3; y++) {
		for (let x = 0; x < 3; x++) {
			if (x === 1 && y === 1) continue
			result.drawImage(base, x, y)
		}
	}
	result.drawImage(image, 1, 1)
	return result.canvas
}
