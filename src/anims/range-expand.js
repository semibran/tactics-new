import { distance } from "../../lib/cell"

export function create(range) {
	return {
		type: "RangeExpand",
		done: false,
		time: 0,
		src: range,
		range: {
			center: range.center,
			radius: range.radius,
			squares: []
		}
	}
}

export function update(anim) {
	if (anim.done) return
	for (let square of anim.src.squares) {
		if (distance(anim.range.center, square.cell) === anim.time) {
			anim.range.squares.push(square)
		}
	}
	if (anim.time++ === anim.range.radius) {
		anim.done = true
	}
}
