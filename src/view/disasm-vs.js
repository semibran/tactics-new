import extract from "../../lib/img-extract"
import replaceColors from "../../lib/canvas-replace"

export default function disasmVs(image, palette) {
	let oldColors = [
		[ 255, 255, 255, 255 ],
		[ 204, 204, 204, 255 ],
		[ 102, 102, 102, 255 ],
		[  51,  51,  51, 255 ],
		[   0,   0,   0, 255 ],
	]
	let newColors = [
		palette.white,
		palette.cyan,
		palette.gray,
		palette.coal,
		palette.jet
	]
	replaceColors(image, oldColors, newColors)
	return image
}
