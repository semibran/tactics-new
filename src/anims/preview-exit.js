import { easeOut } from "../../lib/exponential"

const d = 5

export function create(x) {
	return {
		type: "PreviewExit",
		blocking: true,
		done: false,
		x: x || 1
	}
}

export function update(anim) {
	if (anim.done) return
	anim.x -= 1 / d
	if (anim.x < 0) {
		anim.x = 0
		anim.done = true
	}
}
