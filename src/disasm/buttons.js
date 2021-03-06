import * as Canvas from "../../lib/canvas"
import replaceColors from "../../lib/canvas-replace"
import extract from "../../lib/img-extract"
import renderText from "../view/render-text"

const texts = {
	back: "Cancel",
	move: "Move",
	wait: "Wait",
	attack: "Attack",
	stats: "Stats",
	undo: "Undo"
}

export default function disasmButtons(image, fonts, palette) {
	let buttons = {
		back:   extract(image,  0,  0, 18, 18),
		move:   extract(image, 18,  0, 18, 18),
		wait:   extract(image, 36,  0, 18, 18),
		attack: extract(image,  0, 18, 18, 18),
		stats:  extract(image, 18, 18, 18, 18),
		undo:   extract(image, 36, 18, 18, 18),
	}
	for (let name in buttons) {
		let image = buttons[name]
		let text = renderText(texts[name], {
			font: fonts.standard,
			color: palette.white,
			stroke: palette.jet
		})
		let result = Canvas.create(image.width + 2 + text.width, image.height)
		result.drawImage(image, 0, 0)
		result.drawImage(text, image.width - 6, image.height - text.height + 1)
		buttons[name] = result.canvas
	}
	return buttons
}
