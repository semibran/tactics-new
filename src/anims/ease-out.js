import { easeOut } from "../../lib/exponential"

export function create(duration, delay) {
	return {
		type: "EaseOut",
		done: false,
		duration: duration,
		delay: delay || 0,
		x: 0,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	let time = Math.max(0, anim.time - anim.delay)
	let t = time / anim.duration
	anim.x = easeOut(t)
	anim.time++
	if (anim.time - anim.delay >= anim.duration) {
		anim.done = true
	}
}
