import replaceColors from "../../lib/canvas-replace"
import extract from "../../lib/img-extract"

export default function disasmBars(image, palette) {
	let bars = {
		small: disasmBar(extract(image, 0, 0, 51, 5), palette)
	}
	let oldColors = [
		[ 255, 255, 255, 255 ],
		[ 204, 204, 204, 255 ],
		[ 102, 102, 102, 255 ],
		[  51,  51,  51, 255 ],
		[   0,   0,   0, 255 ],
	]
	let newColors = [
		palette.white,
		palette.opal,
		palette.gray,
		palette.coal,
		palette.jet
	]
	replaceColors(image, oldColors, newColors)
	bars.left = extract(image, 0, 5, 68, 11)
	bars.right = extract(image, 0, 16, 68, 11)
	return bars
}

function disasmBar(image, palette) {
	let oldColors = [
		[ 255, 255, 255, 255 ],
		[ 102, 102, 102, 255 ],
		[  51,  51,  51, 255 ],
		[   0,   0,   0, 255 ],
	]
	let newColors = [
		palette.cream,
		palette.brass,
		palette.coal,
		palette.jet
	]
	replaceColors(image, oldColors, newColors)
	return image
}
