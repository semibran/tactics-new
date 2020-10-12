import replaceColors from "../../lib/canvas-replace"

export default function disasmBar(image, palette) {
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
