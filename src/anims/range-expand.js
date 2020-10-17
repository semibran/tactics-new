import { steps } from "../../lib/cell"

export function create(range) {
	return {
		id: "RangeExpand",
		done: false,
		time: 0,
		src: sort(range),
		range: {
			center: range.center,
			radius: range.radius,
			squares: []
		}
	}
}

export function update(anim) {
	if (anim.done) return
	let edges = anim.src[anim.time]
	anim.range.squares.push(...edges)
	if (anim.time++ === anim.range.radius) {
		anim.done = true
	}
}

function sort(range) {
	let sorted = new Array(range.radius + 1)
	for (let i = 0; i < sorted.length; i++) {
		sorted[i] = []
	}
	for (let square of range.squares) {
		let dist = steps(range.center, square.cell)
		sorted[dist].push(square)
	}
	return sorted
}
