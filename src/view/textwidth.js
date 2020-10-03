export default function findTextWidth(content, font, stroked) {
	let width = 0
	for (let char of content) {
		if (char === " ") {
			width += font.data.spacing.word
			continue
		}
		let cache = font.cache.default
		let image = cache[char]
		if (!image) image = cache[char.toUpperCase()]
		if (!image) continue
		width += image.width + font.data.spacing.char
	}
	if (width) {
		width -= font.data.spacing.char
	}
	if (stroked) {
		width += 2
	}
	return width
}
