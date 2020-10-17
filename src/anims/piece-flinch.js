export function create(src, dest, opts) {
	let disp = { x: dest.x - src.x, y: dest.y - src.y }
	let dist = Math.sqrt(disp.x * disp.x + disp.y * disp.y)
	let norm = { x: disp.x / dist, y: disp.y / dist }
	return {
		id: "PieceFlinch",
		src: src,
		norm: norm,
		cell: { x: src.x, y: src.y },
		opts: opts,
		time: 0,
		flashing: false,
		blocking: true,
		connect: false
	}
}

export function update(anim) {
	if (anim.done) return
	let steps = anim.time <= 10
		? anim.time
		: 10 - (anim.time - 10)

	anim.cell.x = anim.src.x - anim.norm.x / 32 * steps
	anim.cell.y = anim.src.y - anim.norm.y / 32 * steps

	anim.flashing = !anim.flashing

	if (++anim.time === 20) {
		anim.done = true
	}
}
