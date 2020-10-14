import { distance } from "../../lib/cell"

export function create(range) {
	return {
		id: "RangeShrink",
		done: false,
		range: range
	}
}

export function update(anim) {
	if (anim.done) return
	for (let i = 0; i < anim.range.squares.length; i++) {
		let square = anim.range.squares[i]
		if (distance(anim.range.center, square.cell) === anim.range.radius) {
			anim.range.squares.splice(i--, 1)
		}
	}
	if (anim.range.radius-- < 0) {
		anim.done = true
	}
}
