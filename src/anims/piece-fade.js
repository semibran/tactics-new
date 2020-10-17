const duration = 30

export function create(opts) {
	return {
		id: "PieceFade",
		done: false,
		opts: opts,
		time: 0,
		visible: true
	}
}

export function update(anim) {
	if (anim.done) return
	anim.visible = !anim.visible
	if (++anim.time >= 30) {
		anim.done = true
	}
}
