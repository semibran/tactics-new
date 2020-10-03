import Canvas from "../../lib/canvas"
import findTextWidth from "./textwidth"
import makeCharmap from "./charmap"

export default function renderText(content, style, width) {
	let font = style.font
	let id = style.color
		? style.stroke
			? style.color + "+" + style.stroke
			: style.color
		: "default"
	if (!font) throw new Error(`Attempting to render an unregistered font. Is your font exported by fonts/index.js?`)
	if (!font.cache[id]) {
		font.cache[id] = makeCharmap(font.image, font.data, style.color, style.stroke)
	}
	let cached = font.cache[id]
	if (!width) {
		width = findTextWidth(content, font, style.stroke)
	}
	let height = font.data.cellsize.height
	if (style.stroke) {
		height += 2
	}
	let text = Canvas(width, height)
	let x = 0
	let kerning = font.data.spacing.char
	if (style.stroke) {
		kerning -= 2
	}
	for (let char of content) {
		if (char === " ") {
			x += font.data.spacing.word
			continue
		}
		let image = cached[char]
		if (!image) image = cached[char.toUpperCase()]
		if (!image) continue
		text.drawImage(image, x, 0)
		x += image.width + kerning
	}
	return text.canvas
}
