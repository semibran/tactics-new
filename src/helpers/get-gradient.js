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
	let start = palette.hp.opal
	if (faction === "enemy") {
		start = palette.hp.red
	} else if (faction === "ally") {
		start = palette.lime
	}
	let end = palette.maroon
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
