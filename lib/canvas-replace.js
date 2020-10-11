// replaceColor(canvas, oldColors, newColors) -> canvas
// > Replaces all instances of each color in oldColors
// > with their respective indexed counterparts in
// > newColors. The original canvas is mutated for
// > optimal performance (subject to change).
export default function replaceColor(canvas, oldColors, newColors) {
	var context = canvas.getContext("2d")
	var image = context.getImageData(0, 0, canvas.width, canvas.height)
	for (var i = 0; i < image.data.length; i += 4) {
		for (var o = 0; o < oldColors.length; o++) {
			for (var c = 0; c < 4; c++) {
				if (image.data[i + c] !== oldColors[o][c]) {
					break // next color
				}
			}
			if (c === 4) {
				break // match!
			}
		}
		if (o < oldColors.length) {
			// we found a match
			// replace the current pixel
			// with its corresponding color
			for (var c = 0; c < 4; c++) {
				image.data[i + c] = newColors[o][c]
			}
		}
	}
	context.putImageData(image, 0, 0)
	return canvas
}
