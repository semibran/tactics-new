import { equals, distance, neighbors } from "./cell"

function strify(cell) {
	return cell.x + "," + cell.y
}

export default function pathfind(start, goal, opts) {
	var path = []
	var open = [ start ]
	var opened = {}
	var closed = {}
	var parent = {}
	var g = {}
	var f = {}
	if (opts.width && opts.height) {
		for (var y = 0; y < opts.height; y++) {
			for (var x = 0; x < opts.width; x++) {
				g[x + "," + y] = Infinity
				f[x + "," + y] = Infinity
			}
		}
	}
	g[strify(start)] = 0
	f[strify(start)] = distance(start, goal)
	while (open.length) {
		var best = { score: Infinity, index: -1, cell: null }
		for (var i = 0; i < open.length; i++) {
			var cell = open[i]
			var score = f[strify(cell)]
			if (score < best.score) {
				best.score = score
				best.index = i
				best.cell = cell
			}
		}
		var cell = best.cell
		if (equals(cell, goal)) {
			while (!equals(cell, start)) {
				path.unshift(cell)
				cell = parent[strify(cell)]
			}
			path.unshift(cell)
			return path
		}
		open.splice(best.index, 1)
		opened[strify(cell)] = false
		closed[strify(cell)] = true
		var adj = neighbors(cell)
		for (var i = 0; i < adj.length; i++) {
			var neighbor = adj[i]
			if (closed[strify(neighbor)]) {
				continue
			}
			if (!opened[strify(neighbor)]) {
				opened[strify(neighbor)] = true
				open.push(neighbor)
			}
			var score = g[strify(cell)] + 1
			if (score >= g[strify(neighbor)]) {
				continue
			}
			parent[strify(neighbor)] = cell
			g[strify(neighbor)] = score
			f[strify(neighbor)] = score + distance(neighbor, goal)
		}
	}
}
