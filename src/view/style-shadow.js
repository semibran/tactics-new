import * as Canvas from "../../lib/canvas"

export default function drawShadow(image, color) {
	let result = Canvas.create(image.width + 1, image.height + 1)
	let shadow = Canvas.recolor(image, color)
	result.drawImage(shadow, 0, 1)
	result.drawImage(shadow, 1, 0)
	result.drawImage(shadow, 1, 1)
	result.drawImage(image, 0, 0)
	return result.canvas
}
