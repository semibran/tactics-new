import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"

export default function renderTag(width, height, sprites) {
	let palette = sprites.palette
	let tag = Canvas.create(width + 1, height + 1)
	tag.fillStyle = rgb(...palette.silver)
	tag.fillRect(2, 0, width - 2, 1)
	tag.fillStyle = rgb(...palette.coal)
	tag.fillRect(2, 1, width - 2, height - 1)
	tag.fillStyle = rgb(...palette.jet)
	tag.fillRect(2, height, width - 2, 1)
	tag.drawImage(sprites.tag.start, 0, 0)
	tag.drawImage(sprites.tag.end, width - 2, 0)
	return tag.canvas
}
