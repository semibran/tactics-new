import * as Canvas from "../../lib/canvas"
import renderText from "./text"
import renderTag from "./tag"

export default function renderNameTag(name, { fonts, palette }) {
	let text = renderText(name, { font: fonts.standard })
	let shadow = Canvas.recolor(text, palette.jet)
	let tag = renderTag(text.width + 9, text.height + 7 - 2)
		.getContext("2d") // xpad * 2 + 1, ypad * 2 + 1 - baseline
	tag.drawImage(shadow, 5, 3)
	tag.drawImage(shadow, 4, 4)
	tag.drawImage(shadow, 5, 4)
	tag.drawImage(text, 4, 3)
	return tag.canvas
}
