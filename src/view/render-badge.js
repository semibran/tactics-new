import * as Canvas from "../../lib/canvas"

export default function renderBadge(unit, { badges }) {
	let icon = badges[unit.type]
	let orb = badges[unit.faction]
	let badge = Canvas.create(icon.width + 2, icon.height + 1)
	if (unit.type === "mage") {
		badge.drawImage(icon, 1, 1)
		badge.drawImage(orb, 0, 0)
	} else {
		badge.drawImage(icon, 1, 1)
		badge.drawImage(orb, icon.width - orb.width + 2, 0)
	}
	return badge.canvas
}
