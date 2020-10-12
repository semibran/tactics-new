import { easeOut } from "../../lib/exponential"

export function create(duration) {
	return {
		type: "EaseOut",
		done: false,
		duration: duration,
		x: 0,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	let t = anim.time / anim.duration
	anim.x = easeOut(t)
	if (anim.time++ >= anim.duration) {
		anim.done = true
	}
}
