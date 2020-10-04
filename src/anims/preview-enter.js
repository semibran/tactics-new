import { easeOut } from "../../lib/exponential"

const d = 10

export function create() {
	return {
		type: "PreviewEnter",
		blocking: true,
		done: false,
		x: 0,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	let t = anim.time / d
	anim.x = easeOut(t)
	if (anim.time++ === d) {
		anim.done = true
	}
}
