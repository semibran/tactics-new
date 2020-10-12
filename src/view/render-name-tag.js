import * as Canvas from "../../lib/canvas"
import renderText from "./render-text"
import renderTag from "./render-tag"

export default function renderNameTag(name, faction, sprites) {
	const { fonts, palette } = sprites
	const pady = 2
	let text = renderText(name, {
		font: fonts.standard,
		shadow: palette.jet
	})
	let width = 52
	let height = pady + text.height - 3 + pady
	let tag = renderTag(width, height, faction, sprites)
		.getContext("2d")
	let x = Math.ceil(width / 2 - (text.width - 1) / 2)
	tag.drawImage(text, x, pady)
	return tag.canvas
}
