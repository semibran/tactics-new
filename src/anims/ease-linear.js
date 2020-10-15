import { easeOut } from "../../lib/exponential"

export function create(duration, data) {
	return {
		id: "EaseLinear",
		done: false,
		duration: duration,
		data: data,
		x: 0,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	anim.x = anim.time / anim.duration
	anim.time++
	if (anim.time >= anim.duration) {
		anim.done = true
	}
}
