export function create(x, y) {
	return { x: x, y: y }
}

export function x(cell) {
	return cell.x
}

export function y(cell) {
	return cell.y
}

// -- all functions beyond this point rely on the above three methods
// -- to abstract away the internal details of the cell type.

export function format(cell) {
	return [ x(cell), y(cell) ]
}

export function toString(cell) {
	return `(${x(cell)}, ${y(cell)})`
}

export function equals(a, b) {
	return x(a) === x(b)
	    && y(a) === y(b)
}

export function distance(a, b) {
	return Math.abs(x(b) - x(a)) + Math.abs(y(b) - y(a))
}

export function adjacent(a, b) {
	return distance(a, b) === 1
}

export function neighbors(cell) {
	return [
		create(x(cell) - 1, y(cell)),
		create(x(cell) + 1, y(cell)),
		create(x(cell), y(cell) - 1),
		create(x(cell), y(cell) + 1)
	]
}

// neighborhood(cell, radius: int)
// > find all cells within manhattan distance `radius`
export function neighborhood(cell, radius) {
	var start = { steps: 0, cell: cell }
	var queue = [ start ]
	var cells = []
	while (queue.length) {
		var node = queue.shift()
		var adj = neighbors(node.cell)
		for (var i = 0; i < adj.length; i++) {
			var neighbor = adj[i]
			// ignore start cell
			if (equals(cell, neighbor)) {
				continue
			}
			// avoid duplicates
			for (var j = 0; j < cells.length; j++) {
				var other = cells[j]
				if (equals(neighbor, other)) {
					break
				}
			}
			if (j < cells.length) {
				continue
			}
			cells.push(neighbor)
			// if we're still within range, iterate on neighbors
			if (node.steps + 1 < radius) {
				queue.push({
					steps: node.steps + 1,
					cell: neighbor
				})
			}
		}
	}
	return cells
}
