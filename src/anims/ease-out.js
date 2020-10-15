import { easeOut } from "../../lib/exponential"

export function create(duration, data) {
	return {
		id: "EaseOut",
		done: false,
		duration: duration,
		data: Object.assign({ delay: 0 }, data),
		x: 0,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	anim.time++
	let t = Math.max(0, anim.time - anim.data.delay) / anim.duration
	anim.x = easeOut(t)
	if (anim.time - anim.data.delay >= anim.duration) {
		anim.done = true
	}
}
