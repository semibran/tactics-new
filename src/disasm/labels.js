import extract from "../../lib/img-extract"
import replaceColors from "../../lib/canvas-replace"

export default function disasmLabels(image, palette) {
	let oldColors = [
		[ 255, 255, 255, 255 ],
		[ 204, 204, 204, 255 ],
		[ 153, 153, 153, 255 ],
		[ 102, 102, 102, 255 ]
	]
	let newColors = [
		palette.yellow,
		palette.gold,
		palette.brass,
		palette.brown
	]
	replaceColors(image, oldColors, newColors)
	return {
		hp: extract(image, 0, 0, 13, 9),
		ap: extract(image, 0, 9, 13, 9)
	}
}
