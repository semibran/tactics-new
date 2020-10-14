import { easeOut } from "../../lib/exponential"

export function create(duration, delay) {
	return {
		id: "EaseLinear",
		done: false,
		duration: duration,
		delay: delay || 0,
		x: 0,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	anim.x = Math.max(0, anim.time - anim.delay) / anim.duration
	anim.time++
	if (anim.time - anim.delay >= anim.duration) {
		anim.done = true
	}
}
