import lerp from "lerp"

export function create(duration, opts) {
	opts = Object.assign({ src: 0, dest: 1, delay: 0 }, opts)
	return {
		id: "EaseLinear",
		done: false,
		duration: duration,
		src: opts.src || 0,
		dest: opts.dest === undefined ? 1 : opts.dest,
		x: opts.src || 0,
		opts: opts,
		time: 0
	}
}

export function update(anim) {
	if (anim.done) return
	anim.time++
	let time = Math.max(0, anim.time - anim.opts.delay)
	anim.x = lerp(anim.opts.src, anim.opts.dest, time / anim.duration)
	if (time >= anim.duration) {
		anim.done = true
	}
}
