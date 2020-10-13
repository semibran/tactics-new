// color selection
// start -> green/red based on faction
// end -> yellow/lime/cyan/blue based on value
export default function getGradient(unit, palette, reverse) {
	let start = unit.faction === "player"
		? palette.opalhp
		: palette.redhp
	let end = palette.redhp
	if (unit.stats.hp === 15) {
		end = palette.indigohp
	} else if (unit.stats.hp >= 14) {
		end = palette.bluehp
	} else if (unit.stats.hp >= 12) {
		end = palette.cyanhp
	} else if (unit.stats.hp >= 10) {
		end = palette.greenhp
	} else if (unit.stats.hp >= 8) {
		end = palette.yellowhp
	} else if (unit.stats.hp >= 6) {
		end = palette.orangehp
	}
	if (reverse) {
		return [ end, start ]
	} else {
		return [ start, end ]
	}
}
