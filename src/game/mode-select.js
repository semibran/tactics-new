import * as Comps from "./comps"
import * as Camera from "./camera"
import * as PieceLift from "../anims/piece-lift"
import * as PieceDrop from "../anims/piece-drop"
import * as Cell from "../../lib/cell"
import * as Unit from "./unit"
import * as Map from "./map"
import findRange from "./range"
import getCell from "../helpers/get-cell"
import pathfind from "../../lib/pathfind"
import renderArrow from "../../lib/pathfind"

const tilesize = 16

export function create(data) {
	return {
		id: "Select",
		next: null,
		comps: [],
		anim: null,
		unit: data.unit,
		held: data.held,
		sprites: null,
		map: null,
		range: null,
		select: null,
		pointer: {
			selecting: false
		}
	}
}

export function onenter(mode, screen) {
	let unit = mode.unit

	// center camera (unless holdselect was used)
	if (!mode.held) {
		Camera.center(screen.camera, screen.map, unit.cell)
	} else {
		mode.select = {
			cursor: null,
			path: null,
			valid: false
		}
	}

	// add range component
	let rangedata = findRange(unit, screen.map)
	let range = Comps.Range.create(rangedata, screen.view.sprites)
	mode.comps.push(range)
	mode.range = rangedata

	// add preview component
	let preview = Comps.Preview.create(unit, screen.view.sprites)
	mode.comps.push(preview)

	// add piece lift animation
	mode.anim = PieceLift.create()
	screen.anims.push(mode.anim)

	// cache screen refs
	mode.sprites = screen.view.sprites
	mode.map = screen.map
}

export function onexit(mode, screen) {
	// close components
	for (let comp of mode.comps) {
		Comps[comp.id].exit(comp)
	}

	// remove piece lift animation
	mode.anim.done = true
	mode.anim = PieceDrop.create(mode.anim.y)
	screen.anims.push(mode.anim)
}

export function onmove(mode, screen, pointer) {
	if (!mode.held) {
		Camera.pan(screen.camera, pointer)
		return
	}
	let cursor = getCell(pointer.pos, screen.map, screen.camera)
	if (cursor) {
		hover(mode, cursor)
	}
}

export function onrelease(mode, screen, pointer) {
	if (pointer.mode === "click" && !mode.held) {
		mode.next = { id: "Home" }
	} else {
		unhover(mode)
	}
	mode.held = false
}

export function render(mode, screen) {
	let origin = screen.camera.origin
	let pointer = screen.view.pointer
	let sprites = screen.view.sprites
	let viewport = screen.view.viewport
	let select = mode.select
	let unit = mode.unit
	let nodes = []

	// render cursor
	if (select && select.cursor) {
		let cursor = select.cursor
		nodes.push({
			layer: "cursor",
			image: sprites.select.cursor[mode.unit.faction],
			x: origin.x + cursor.pos.x - 1,
			y: origin.y + cursor.pos.y - 1
		})
	}

	// render arrow
	if (select && select.arrow) {
		nodes.push({
			layer: "arrow",
			image: select.arrow,
			x: origin.x,
			y: origin.y
		})
	}

	// render mirage
	if (select) {
		let image = sprites.pieces[unit.faction][unit.type]
		let x = pointer.pos.x / viewport.scale - image.width / 2
		let y = pointer.pos.y / viewport.scale - image.height - 8
		let opacity = 0.75
		if (!mode.select.valid) {
			opacity = 0.25
		}
		nodes.push({
			layer: "mirage",
			image, x, y, opacity
		})
	}

	return nodes
}

export function onupdate(mode, screen) {
	// update cursor
	let select = mode.select
	if (select && select.cursor) {
		let cursor = select.cursor
		if (Math.round(cursor.cached.x) !== Math.round(cursor.pos.x)
		|| Math.round(cursor.cached.y) !== Math.round(cursor.pos.y)) {
			cursor.cached.x = cursor.pos.x
			cursor.cached.y = cursor.pos.y
			screen.dirty = true
		}
		cursor.pos.x += (cursor.target.x * tilesize - cursor.pos.x) / 4
		cursor.pos.y += (cursor.target.y * tilesize - cursor.pos.y) / 4
	}
}

function hover(mode, cell) {
	let { map, unit, range, sprites } = mode

	// break if the hovered cell hasn't changed
	let cpath = mode.path
	let cdest = cpath ? cpath[cpath.length - 1] : null
	if (cpath && Cell.equals(cdest, cell)) {
		return
	}

	// check if the selected square is walkable
	let square = range.squares.find(square => {
		return square.type === "move" && Cell.equals(square.cell, cell)
	})

	let path = null
	if (square) {
		let dest = cell
		let opts = {
			width: map.width,
			height: map.height,
			blacklist: map.units // make enemy units unwalkable
				.filter(other => !Unit.allied(unit, other))
				.map(unit => unit.cell)
		}

		// add to previous path if existent
		if (cpath) {
			let apath = pathfind(cdest, dest, opts)

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
				if (length <= Unit.mov(unit)) {
					path = cpath.concat(apath.slice(1))
				}
			}
		}

		// no path cached
		if (!path) {
			path = pathfind(unit.cell, dest, opts)
		}
	}
	if (path) {
		if (!mode.select.cursor) {
			let pos = {
				x: cell.x * tilesize,
				y: cell.y * tilesize
			}
			mode.select.cursor = {
				pos: pos,
				target: cell,
				cached: pos
			}
		} else {
			mode.select.cursor.target = cell
		}
		mode.select.valid = true
		mode.select.arrow = sprites.Arrow(path, unit.faction)
		mode.select.path = path
	} else {
		mode.select.valid = false
		mode.select.cursor = null
	}
}

function unhover(mode) {
	mode.select = null
}
