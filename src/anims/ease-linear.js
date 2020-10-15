import lerp from "lerp"

export function create(duration, data) {
	data = Object.assign({ src: 0, dest: 1, delay: 0 }, data)
	return {
		id: "EaseLinear",
		done: false,
		duration: duration,
		src: data.src || 0,
		dest: data.dest === undefined ? 1 : data.dest,
		x: data.src || 0,
		data: data,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	anim.time++
	let time = Math.max(0, anim.time - anim.data.delay)
	anim.x = lerp(anim.data.src, anim.data.dest, time / anim.duration)
	if (time >= anim.duration) {
		anim.done = true
	}
}
