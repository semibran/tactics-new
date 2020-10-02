import * as pixels from "../../lib/pixels"
import extract from "../../lib/img-extract"

export default function makeCharmap(image, props, color) {
	let charmap = {}
	let cols = image.width / props.cellsize.width
	let rows = image.height / props.cellsize.height
	if (color) {
		image = pixels.toImage(pixels.replace(pixels.fromImage(image), [ 255, 255, 255 ], color))
	}
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < cols; x++) {
			let char = props.layout[y][x]
			if (!char) continue
			let size = {
				width: props.charsize.width,
				height: props.charsize.height
			}
			let offsets = props.exceptions[char]
			for (let axis in offsets) {
				size[axis] = offsets[axis]
			}
			charmap[char] = extract(image, x * props.cellsize.width, y * props.cellsize.height, size.width, size.height)
		}
	}
	return charmap
}
