// color selection
// start -> green/red based on faction
// end -> yellow/lime/cyan/blue based on value
export default function getGradient(unit, palette, reverse) {
	let start = unit.faction === "player"
		? palette.green
		: palette.red
	let end = palette.pink
	if (unit.stats.hp >= 14) {
		end = palette.blue
	} else if (unit.stats.hp >= 11) {
		end = palette.cyan
	} else if (unit.stats.hp >= 9) {
		end = palette.lime
	} else if (unit.stats.hp >= 7) {
		end = palette.yellow
	}
	if (reverse) {
		return [ end, start ]
	} else {
		return [ start, end ]
	}
}
