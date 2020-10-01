export function fromImage(image) {
	var canvas = document.createElement("canvas")
	var context = canvas.getContext("2d")
	canvas.width = image.width
	canvas.height = image.height
	context.drawImage(image, 0, 0)
	return context.getImageData(0, 0, canvas.width, canvas.height)
}

export function toImage(data) {
	var canvas = document.createElement("canvas")
	var context = canvas.getContext("2d")
	canvas.width = data.width
	canvas.height = data.height
	context.putImageData(data, 0, 0)
	return canvas
}

export function get(image, x, y) {
	var i = (y * image.width + x) * 4
	var r = image.data[i]
	var g = image.data[i + 1]
	var b = image.data[i + 2]
	var a = image.data[i + 3]
	return [ r, g, b, a ]
}

export function set(image, x, y, color) {
	var i = (y * image.width + x) * 4
	image.data[i + 0] = color[0]
	image.data[i + 1] = color[1]
	image.data[i + 2] = color[2]
	image.data[i + 3] = color[3]
}

export function replace(image, oldColor, newColor) {
	if (!oldColor[3]) {
		oldColor = oldColor.slice()
		oldColor[3] = 255
	}
	if (!newColor[3]) {
		newColor = newColor.slice()
		newColor[3] = 255
	}
	for (var i = 0; i < image.data.length; i += 4) {
		for (var c = 0; c < 4; c++) {
			if (image.data[i + c] !== oldColor[c]) {
				break
			}
		}

		if (c !== 4) {
			continue
		}

		for (var c = 0; c < 4; c++) {
			image.data[i + c] = newColor[c]
		}
	}
	return image
}
