import extract from "../../lib/img-extract"
import replaceColors from "../../lib/canvas-replace"

export default function disasmTag(image, palette) {
	let oldColors = [
		[ 255, 255, 255, 255 ],
		[ 204, 204, 204, 255 ],
		[ 153, 153, 153, 255 ],
		[ 102, 102, 102, 255 ],
		[  51,  51,  51, 255 ],
		[   0,   0,   0, 255 ],
	]
	let newColors = [
		palette.yellow,
		palette.gold,
		palette.brass,
		palette.silver,
		palette.coal,
		palette.jet
	]
	replaceColors(image, oldColors, newColors)
	return {
		start: extract(image, 0, 0, 2, 12),
		end: extract(image, 2, 0, 3, 12)
	}
}
