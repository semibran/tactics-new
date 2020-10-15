import lerp from "lerp"

export function create(duration, src, dest, data) {
	return {
		id: "EaseLinear",
		done: false,
		duration: duration,
		src: src || 0,
		dest: dest === undefined ? 1 : dest,
		x: src || 0,
		data: Object.assign({ delay: 0 }, data),
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	anim.time++
	let time = Math.max(0, anim.time - anim.data.delay)
	anim.x = lerp(anim.src, anim.dest, time / anim.duration)
	if (time >= anim.duration) {
		anim.done = true
	}
}
