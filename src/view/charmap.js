import * as pixels from "../../lib/pixels"
import extract from "../../lib/img-extract"
import Canvas from "../../lib/canvas"

export default function makeCharmap(image, font, color, stroke) {
	let charmap = {}
	let cols = image.width / font.cellsize.width
	let rows = image.height / font.cellsize.height
	let recolor = image
	if (color) {
		recolor = pixels.toImage(
			pixels.replace(
				pixels.fromImage(image),
				[ 255, 255, 255 ],
				color
			)
		)
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
			if (stroke) {
				let base = extract(recolor, x, y, size.width, size.height)
				charmap[char] = drawStroke(base, color, stroke)
			} else {
				charmap[char] = extract(recolor, x, y, size.width, size.height)
			}
		}
	}
	return charmap
}

function drawStroke(image, color, stroke) {
	let result = Canvas(image.width + 2, image.height + 2)
	let data = image
		.getContext("2d")
		.getImageData(0, 0, image.width, image.height)
	pixels.replace(data, color, stroke)
	let base = pixels.toImage(data)
	for (let y = 0; y < 3; y++) {
		for (let x = 0; x < 3; x++) {
			if (x === 1 && y === 1) continue
			result.drawImage(base, x, y)
		}
	}
	result.drawImage(image, 1, 1)
	return result.canvas
}
