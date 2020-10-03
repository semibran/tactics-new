import { distance } from "../../lib/cell"

export function create(range, center, radius) {
	return {
		type: "RangeExpand",
		done: false,
		time: 0,
		range: range,
		center: center,
		radius: radius,
		squares: []
	}
}

export function update(anim) {
	if (anim.done) return
	for (let cell of anim.range.move) {
		if (distance(anim.center, cell) === anim.time) {
			anim.squares.push({ type: "move", cell })
		}
	}
	for (let cell of anim.range.attack) {
		if (distance(anim.center, cell) === anim.time) {
			anim.squares.push({ type: "attack", cell })
		}
	}
	if (anim.time++ === anim.radius) {
		anim.done = true
	}
}
