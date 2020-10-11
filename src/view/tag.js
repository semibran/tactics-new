import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"

export default function renderTag(width, height, { palette }) {
	let tag = Canvas.create(width + 1, height + 1)
	tag.fillStyle = rgb(...palette.jet)
	tag.fillRect(1, 0, width - 1, height + 1)
	tag.fillRect(0, 1, width + 1, height - 1)
	tag.fillStyle = rgb(...palette.silver)
	tag.fillRect(1, 0, width - 2, 1)
	tag.fillRect(0, 1, width, 1)
	tag.fillStyle = rgb(...palette.gray)
	tag.fillRect(1, 1, width - 2, height - 1)
	tag.fillRect(0, 2, width, height - 3)
	return tag.canvas
}
