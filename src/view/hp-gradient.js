// color selection
// start -> green/red based on faction
// end -> yellow/lime/cyan/blue based on value
export default function getGradient(hp, faction, palette, reverse) {
	let start = faction === "player"
		? palette.hp.opal
		: palette.hp.red
	let end = palette.hp.red
	if (hp === 15) {
		end = palette.hp.indigo
	} else if (hp >= 14) {
		end = palette.hp.blue
	} else if (hp >= 12) {
		end = palette.hp.cyan
	} else if (hp >= 10) {
		end = palette.hp.green
	} else if (hp >= 8) {
		end = palette.hp.yellow
	} else if (hp >= 3) {
		end = palette.hp.orange
	}
	if (reverse) {
		return [ end, start ]
	} else {
		return [ start, end ]
	}
}
