// color selection
// start -> varies based on faction (blue/red)
// end -> varies based on value:
//   red    -> 1..2
//   orange -> 4..5
//   yellow -> 6..8
//   green  -> 9..11
//   blue   -> 12..14
//   indigo -> 15
export default function getGradient(hp, faction, palette, reverse) {
	let start = faction === "player"
		? palette.hp.opal
		: palette.hp.red
	let end = palette.hp.red
	if (hp === 15) {
		end = palette.hp.indigo
	} else if (hp >= 12) {
		end = palette.hp.blue
	} else if (hp >= 9) {
		end = palette.hp.green
	} else if (hp >= 6) {
		end = palette.hp.yellow
	} else if (hp >= 4) {
		end = palette.hp.orange
	}
	if (reverse) {
		return [ end, start ]
	} else {
		return [ start, end ]
	}
}
