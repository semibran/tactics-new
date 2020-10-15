import lerp from "lerp"

export function create(duration, src, dest) {
	return {
		id: "EaseLinear",
		done: false,
		duration: duration,
		src: src || 0,
		dest: dest === undefined ? 1 : dest,
		x: src || 0,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	anim.time++
	anim.x = lerp(anim.src, anim.dest, anim.time / anim.duration)
	if (anim.time >= anim.duration) {
		anim.done = true
	}
}
