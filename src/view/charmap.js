import * as pixels from "../../lib/pixels"
import * as Canvas from "../../lib/canvas"
import extract from "../../lib/img-extract"

export default function makeCharmap(image, font, color, stroke) {
	let charmap = {}
	let cols = image.width / font.cellsize.width
	let rows = image.height / font.cellsize.height
	if (color) {
		image = Canvas.replace(image, [ 255, 255, 255 ], color)
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
				? drawStroke(base, stroke)
				: base
		}
	}
	return charmap
}

function drawStroke(image, color) {
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
