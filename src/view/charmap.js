import * as Canvas from "../../lib/canvas"
import outline from "./outline"
import extract from "../../lib/img-extract"

export default function makeCharmap(image, font, color, stroke) {
	if (!image) {
		throw new Error(`No image found for font ${font.id}. Try rebuilding your spritesheet.`)
	}
	let charmap = {}
	let cols = image.width / font.cellsize.width
	let rows = image.height / font.cellsize.height
	if (color) {
		image = Canvas.replace(image, [ 255, 255, 255, 255 ], color)
	}
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			let char = font.layout[row][col]
			if (!char) continue
			let size = {
				width: font.charsize.width,
				height: font.charsize.height
			}
			let offsets = font.exceptions[char]
			for (let axis in offsets) {
				size[axis] = offsets[axis]
			}
			let x = col * font.cellsize.width
			let y = row * font.cellsize.height
			let base = extract(image, x, y, size.width, size.height)
			charmap[char] = stroke
				? outline(base, stroke)
				: base
		}
	}
	return charmap
}
