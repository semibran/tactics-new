import * as Map from "./map"
import * as Unit from "./unit"
import * as Cell from "../../lib/cell"
import astar from "../../lib/pathfind"
import unwalkables from "./unwalkables"

export default function pathfind(unit, dest, map, cache) {
	let path = null
	let opts = {
		width: map.width,
		height: map.height,
		blacklist: unwalkables(map, unit)
	}

	// add to previous path if existent
	if (cache) {
		let cpath = cache
		let cdest = cpath[cpath.length - 1]
		let apath = astar(cdest, dest, opts)

		// cut path if it loops in on itself
		for (let i = apath.length; --i >= 1;) {
			for (let j = 0; j < cpath.length; j++) {
				if (Cell.equals(apath[i], cpath[j])) {
					path = cpath.slice(0, j).concat(apath.slice(i))
					break
				}
			}
			if (path) {
				break
			}
		}

		// path does not loop in on itself
		if (!path) {
			// add addendum to cached if it's not too long
			let length = cpath.length + apath.length - 2
			if (length <= unit.stats.mov) {
				path = cpath.concat(apath.slice(1))
			}
		}
	}

	// no path cached, start from scratch
	if (!path) {
		path = astar(unit.cell, dest, opts)
	}

	return path
}
