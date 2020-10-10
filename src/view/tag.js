import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"

export default function renderTag(width, height, { palette }) {
	let tag = Canvas.create(width, height)
	tag.fillStyle = rgb(...palette.jet)
	tag.fillRect(1, 0, tag.canvas.width - 2, tag.canvas.height)
	tag.fillRect(0, 1, tag.canvas.width, tag.canvas.height - 2)
	tag.fillStyle = rgb(...palette.silver)
	tag.fillRect(1, 0, tag.canvas.width - 3, 1)
	tag.fillRect(0, 1, tag.canvas.width - 1, 1)
	tag.fillStyle = rgb(...palette.gray)
	tag.fillRect(1, 1, tag.canvas.width - 3, tag.canvas.height - 2)
	tag.fillRect(0, 2, tag.canvas.width - 1, tag.canvas.height - 4)
	return tag.canvas
}
