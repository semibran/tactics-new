import * as Canvas from "../../lib/canvas"
import renderText from "./render-text"
import renderTag from "./render-tag"

export default function renderNameTag(name, faction, sprites) {
	const { fonts, palette } = sprites
	const padx = 12
	const pady = 2
	let text = renderText(name, fonts.standard, { shadow: palette.jet })
	let width = padx + text.width - 1 + padx
	let height = pady + text.height - 3 + pady
	let tag = renderTag(width, height, faction, sprites)
		.getContext("2d")
	tag.drawImage(text, padx, pady)
	return tag.canvas
}
