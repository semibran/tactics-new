import { height } from "./piece-lift"

export function create(y) {
	return {
		type: "PieceDrop",
		y: y || height
	}
}

export function update(anim) {
	if (anim.done) return
	if (--anim.y <= 0) {
		anim.y = 0
		anim.done = true
	}
}
