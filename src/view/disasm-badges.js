import * as Canvas from "../../lib/canvas"
import rgb from "../../lib/rgb"
import stroke from "./stroke"

export default function disasmBadges(palette, icons) {
	let badges = {}
	for (let faction in palette.factions) {
		let subpal = palette.factions[faction]
		let badge = Canvas.create(4, 4)
		badge.fillStyle = rgb(...palette.jet)
		badge.fillRect(1, 0, 2, 4)
		badge.fillRect(0, 1, 4, 2)
		badge.fillStyle = rgb(...subpal.normal)
		badge.fillRect(1, 1, 2, 2)
		badge.fillStyle = rgb(...subpal.light)
		badge.fillRect(2, 1, 1, 1)
		badges[faction] = badge.canvas
	}

	let base = Canvas.create(8, 8)
	base.fillStyle = rgb(...palette.jet)
	base.fillRect(1, 0, 6, 8)
	base.fillRect(0, 1, 8, 6)
	base.fillStyle = rgb(...palette.gray)
	base.fillRect(1, 1, 6, 6)
	badges.base = base.canvas

	for (let iconname in icons.types) {
		let unittype = icons.types[iconname]
		let icon = stroke(icons.small[iconname], palette.jet)
		let badge = Canvas.copy(base.canvas)
		badge.drawImage(icon, 0, 0)
		badges[unittype] = badge.canvas
	}

	return badges
}
