import Canvas from "../../lib/canvas"
import findTextWidth from "./textwidth"

export default function renderText(content, font, color, width) {
	let cache = font.cache[color] || font.cache.default
	if (!width) {
		width = findTextWidth(content, font)
	}
	let text = Canvas(width, font.data.cellsize.height)
	let x = 0
	for (let char of content) {
		if (char === " ") {
			x += font.data.spacing.word
			continue
		}
		let image = cache[char]
		if (!image) image = cache[char.toUpperCase()]
		if (!image) continue
		text.drawImage(image, x, 0)
		x += image.width + font.data.spacing.char
	}
	return text.canvas
}
