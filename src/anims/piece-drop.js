import { height } from "./piece-lift"

export function create(opts) {
	Object.assign({ y: height }, opts)
	return {
		id: "PieceDrop",
		done: false,
		opts: opts,
		y: opts.y || height
	}
}

export function update(anim) {
	if (anim.done) return
	if (--anim.y <= 0) {
		anim.y = 0
		anim.done = true
	}
}
