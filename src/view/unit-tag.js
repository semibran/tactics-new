import * as Canvas from "../../lib/canvas"
import renderBadge from "./badge"
import renderText from "./text"
import renderTag from "./tag"

export default function renderUnitTag(unit, { fonts, badges, palette }) {
	let badge = renderBadge(unit, { badges })
	let text = renderText(unit.name, { font: fonts.standard })
	let shadow = Canvas.recolor(text, palette.jet)
	let width = 3 + badge.width + 1 + text.width + 3 + 1
	let height = 3 + text.height - 2 + 3 + 1
	let tag = renderTag(width, height, { palette })
		.getContext("2d") // xpad * 2 + 1, ypad * 2 + 1 - baseline
	tag.drawImage(badge, 2, 2)
	tag.drawImage(shadow, 14, 3)
	tag.drawImage(shadow, 13, 4)
	tag.drawImage(shadow, 14, 4)
	tag.drawImage(text, 13, 3)
	return tag.canvas
}
