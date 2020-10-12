export default function getBadge(unit, badges) {
	let badge = badges.sword
	if (unit.type === "fighter") {
		badge = badges.axe
	} else if (unit.type === "knight") {
		badge = badges.lance
	} else if (unit.type === "thief") {
		badge = badges.dagger
	} else if (unit.type === "archer") {
		badge = badges.bow
	} else if (unit.type === "mage") {
		if (badges[unit.stats.element]) {
			badge = badges[unit.stats.element]
		}
	}
	return badge
}
