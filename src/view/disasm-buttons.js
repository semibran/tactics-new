import replaceColors from "../../lib/canvas-replace"
import extract from "../../lib/img-extract"

export default function disasmButtons(image, palette) {
	return {
		large:     extract(image,  0,  0, 24, 24),
		small:     extract(image,  0, 24, 18, 18),
		boot:      extract(image, 24,  0, 15, 14),
		sword:     extract(image, 39,  0, 14, 14),
		hourglass: extract(image, 53,  0, 13, 15),
		stats:     extract(image, 24, 14, 14, 15),
		undo:      extract(image, 38, 15, 17, 15),
		back:      extract(image, 55, 15, 14, 13),
	}
}
