// color selection
// start -> green/red based on faction
// end -> yellow/lime/cyan/blue based on value
export default function getGradient(hp, faction, palette, reverse) {
	let start = faction === "player"
		? palette.opalhp
		: palette.redhp
	let end = palette.redhp
	if (hp === 15) {
		end = palette.indigohp
	} else if (hp >= 14) {
		end = palette.bluehp
	} else if (hp >= 12) {
		end = palette.cyanhp
	} else if (hp >= 10) {
		end = palette.greenhp
	} else if (hp >= 8) {
		end = palette.yellowhp
	} else if (hp >= 3) {
		end = palette.orangehp
	}
	if (reverse) {
		return [ end, start ]
	} else {
		return [ start, end ]
	}
}
