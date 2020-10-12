import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"

export default function renderTag(width, height, faction, sprites) {
	let palette = sprites.tag[faction].palette
	let tag = Canvas.create(width + 1, height + 1)
	tag.fillStyle = rgb(...palette[0])
	tag.fillRect(2, 0, width - 2, 1)
	tag.fillStyle = rgb(...palette[1])
	tag.fillRect(2, 1, width - 2, height - 1)
	tag.fillStyle = rgb(...palette[2])
	tag.fillRect(2, height, width - 2, 1)
	tag.drawImage(sprites.tag[faction].start, 0, 0)
	tag.drawImage(sprites.tag[faction].end, width - 2, 0)
	return tag.canvas
}
