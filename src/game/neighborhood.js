export default function neighborhood(cell, rng) {
	let cells = []
	let radius = rng.end
	for (let ry = -rng.end; ry <= rng.end; ry++) {
		for (let rx = -rng.end; rx <= rng.end; rx++) {
			let steps = Math.abs(rx) + Math.abs(ry)
			if (steps < rng.start || steps > rng.end) continue
			cells.push({ x: cell.x + rx, y: cell.y + ry })
		}
	}
	return cells
}
