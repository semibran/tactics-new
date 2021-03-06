import * as pixels from "./pixels"

export default create

export function create(width, height) {
	var canvas = document.createElement("canvas")
	canvas.width = width
	canvas.height = height
	return canvas.getContext("2d")
}

export function copy(canvas) {
	var result = create(canvas.width, canvas.height)
	result.drawImage(canvas, 0, 0)
	return result
}

export function replace(canvas, oldColor, newColor) {
	return pixels.toCanvas(pixels.replace(pixels.fromCanvas(canvas), oldColor, newColor))
}

export function recolor(canvas, newColor) {
	return pixels.toCanvas(pixels.recolor(pixels.fromCanvas(canvas), newColor))
}
