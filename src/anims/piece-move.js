import lerp from "lerp"

export function create(path) {
	return {
		type: "PieceMove",
		time: 0,
		path: path,
		cell: {
			x: path[0].x,
			y: path[0].y
		}
	}
}

export function update(anim) {
	if (anim.done) return false
	let index = Math.floor(anim.time / 4)
	let t = anim.time % 4 / 4
	let cell = anim.path[index]
	let next = anim.path[index + 1]
	if (next) {
		anim.cell.x = lerp(cell.x, next.x, t)
		anim.cell.y = lerp(cell.y, next.y, t)
	} else {
		anim.cell.x = cell.x
		anim.cell.y = cell.y
		anim.done = true
	}
	anim.time++
	return true
}
