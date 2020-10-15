import { easeOut } from "../../lib/exponential"

export function create(duration, data) {
	return {
		id: "EaseOut",
		done: false,
		duration: duration,
		data: data,
		x: 0,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	let t = anim.time / anim.duration
	anim.x = easeOut(t)
	if (++anim.time >= anim.duration) {
		anim.done = true
	}
}
