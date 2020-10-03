import { easeOut } from "../../lib/exponential"

const d = 5

export function create() {
	return {
		type: "PreviewExit",
		done: false,
		x: 0,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	let t = anim.time / d
	anim.x = 1 - t
	if (anim.time++ === d) {
		anim.done = true
	}
}
