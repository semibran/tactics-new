export function create(src, dest) {
	let disp = { x: dest.x - src.x, y: dest.y - src.y }
	let dist = Math.sqrt(disp.x * disp.x + disp.y * disp.y)
	let norm = { x: disp.x / dist, y: disp.y / dist }
	return {
		id: "PieceAttack",
		src: src,
		norm: norm,
		cell: { x: src.x, y: src.y },
		time: 0,
		connect: false
	}
}

export function update(anim) {
	if (anim.done) return
	let steps = anim.time <= 7
		? anim.time
		: 7 - (anim.time - 7)

	if (anim.time >= 8) {
		anim.connect = true
	}

	anim.cell.x = anim.src.x + anim.norm.x / 8 * steps
	anim.cell.y = anim.src.y + anim.norm.y / 8 * steps

	if (++anim.time === 15) {
		anim.done = true
	}
}
