import replaceColors from "../../lib/canvas-replace"
import extract from "../../lib/img-extract"
import rgb from "../../lib/rgb"
import stroke from "./style-stroke"

export default function disasmBadges(image, palette) {
	let oldColors = [
		[ 255, 255, 255, 255 ],
		[ 204, 204, 204, 255 ],
		[ 102, 102, 102, 255 ],
		[   0,   0,   0, 255 ],
	]
	let newColors = [
		palette.white,
		palette.silver,
		palette.gray,
		palette.jet
	]
	replaceColors(image, oldColors, newColors)
	return {
		sword:  extract(image,  0,  0, 8, 8),
		lance:  extract(image,  8,  0, 8, 8),
		axe:    extract(image, 16,  0, 8, 8),
		bow:    extract(image, 24,  0, 8, 8),
		shield: extract(image,  0,  8, 8, 8),
		target: extract(image,  8,  8, 8, 8),
		wing:   extract(image, 16,  8, 8, 8),
		dagger: extract(image, 24,  8, 8, 8),
		fire:   extract(image,  0, 16, 8, 8),
		ice:    extract(image,  8, 16, 8, 8),
		volt:   extract(image, 16, 16, 8, 8),
		dark:   extract(image, 24, 16, 8, 8)
	}
}
