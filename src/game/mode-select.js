import * as Comps from "./comps"
import * as Camera from "./camera"
import * as PieceLift from "../anims/piece-lift"
import * as PieceDrop from "../anims/piece-drop"
import * as PieceMove from "../anims/piece-move"
import * as Cell from "../../lib/cell"
import * as Unit from "./unit"
import nbrhd from "./neighborhood"
import getCell from "../helpers/get-cell"
import pathfind from "./pathfind"
import findRange from "./range"
import inRange from "in-range"

const tilesize = 16

export function create(data) {
	return {
		id: "Select",
		next: null,
		comps: [],
		commands: [],
		anims: [],
		anim: null,
		unit: data.unit,
		held: data.held,
		playable: true,
		sprites: null,
		map: null,
		range: null,
		select: null
	}
}

export function onenter(mode, screen) {
	let unit = mode.unit

	// add range component
	let rangedata = findRange(unit, screen.map)
	let range = Comps.Range.create(rangedata, screen.view.sprites)
	mode.comps.push(range)
	mode.range = rangedata

	// add preview component
	let preview = Comps.Preview.create(unit, "bottomleft", screen.view.sprites)
	mode.comps.push(preview)

	// add piece lift animation
	mode.anim = PieceLift.create({ unit })
	mode.anims.push(mode.anim)

	// cache screen refs
	mode.sprites = screen.view.sprites
	mode.map = screen.map

	// playable flag: determines whether we can move this unit
	mode.playable = screen.data.phase.pending.includes(unit)

	// center camera (unless holdselect was used)
	if (!mode.held) {
		Camera.center(screen.camera, screen.map, unit.cell)
	} else {
		let pointer = screen.view.pointer
		let cursor = getCell(pointer.pos, screen.map, screen.camera)
		if (cursor) {
			hover(mode, cursor)
		}
	}
}

export function onexit(mode, screen) {
	// remove piece lift animation
	if (mode.anim && mode.anim.id === "PieceLift" && !mode.anim.done) {
		mode.anim.done = true
		mode.anim = PieceDrop.create({ y: mode.anim.y, unit: mode.unit })
		mode.anims.push(mode.anim)
	}
}

export function onresize(mode, viewport) {
	// call comp onresize hooks
	for (let comp of mode.comps) {
		let onresize = Comps[comp.id].onresize
		if (onresize) {
			onresize(comp, viewport)
		}
	}
}

export function onpress(mode, screen, pointer) {
	if (mode.anim && mode.anim.blocking) return
	let cursor = getCell(pointer.pos, screen.map, screen.camera)
	if (cursor && mode.playable) {
		hover(mode, cursor)
	}
}

export function onmove(mode, screen, pointer) {
	if (mode.anim && mode.anim.blocking) return
	if (!mode.select) {
		Camera.pan(screen.camera, screen.map, pointer)
		return
	}
	let cursor = getCell(pointer.pos, screen.map, screen.camera)
	if (cursor && mode.playable) {
		hover(mode, cursor)
	}
}

export function onrelease(mode, screen, pointer) {
	if (mode.anim && mode.anim.blocking) return
	let { select, unit } = mode
	if (pointer.mode === "click" && !mode.held && !select) {
		mode.commands.push({ type: "cancel" })
	} else if (select && select.valid) {
		let path = select.path
		let dest = path[path.length - 1]
		let target = select.target && select.target.unit
		if (Cell.equals(unit.cell, dest)) {
			// end turn
			if (target) {
				mode.commands.push({ type: "forecast", unit, target })
			} else {
				mode.commands.push({ type: "cancel" })
				// mode.commands.push({ type: "endTurn", unit })
			}
		} else {
			// move to dest
			move(mode, path, target)
		}
	} else if (select) {
		unhover(mode)
	}
	mode.held = false
}

export function render(mode, screen) {
	let nodes = []

	let origin = screen.camera.origin
	let pointer = screen.view.pointer
	let sprites = screen.view.sprites
	let viewport = screen.view.viewport
	let select = mode.select
	let unit = mode.unit
	let anim = mode.anim
	let moving = screen.anims.find(anim => anim.id === "PieceMove")
	let selectvis = anim && (!moving || screen.time % 2)
	if (moving && moving.done) {
		mode.select = null
	}

	// render ring
	if (selectvis && screen.data.phase.pending.includes(unit)
	&& (!screen.nextmode || mode.anims
		.concat(screen.anims)
		.find(anim => anim.id === "PieceDrop"))
	) {
		let image = sprites.select.ring[unit.control.faction]
		let x = origin.x + unit.cell.x * screen.map.tilesize - 2
		let y = origin.y + unit.cell.y * screen.map.tilesize - 2
		nodes.push({
			layer: "ring",
			image, x, y
		})
	}

	// render arrow
	let arrow = select && select.arrow
	if (arrow && selectvis) {
		nodes.push({
			layer: "arrow",
			image: arrow,
			x: origin.x,
			y: origin.y
		})
	}

	// render cursor
	let cursor = select && select.cursor
	if (cursor && selectvis && !Cell.equals(cursor.target, unit.cell)) {
		nodes.push({
			layer: "cursor",
			image: sprites.select.cursor[unit.control.faction],
			x: origin.x + cursor.pos.x - 1,
			y: origin.y + cursor.pos.y - 1
		})
	}

	// render mirage
	if (select && anim && !moving && (!cursor || !Cell.equals(cursor.target, unit.cell))) {
		let image = sprites.pieces[unit.control.faction][unit.type]
		let x = pointer.pos.x / viewport.scale - image.width / 2
		let y = pointer.pos.y / viewport.scale - image.height - 8
		let opacity = 0.75
		if (!select.valid) {
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
	let { map, unit, range, sprites, select } = mode

	// break if the hovered cell hasn't changed
	let cpath = select && select.path
	let cdest = cpath ? cpath[cpath.length - 1] : null
	if (cpath && Cell.equals(cdest, cell)
	&& (!select.cursor || Cell.equals(select.cursor.target, cell))
	) {
		return true
	}

	let path = null
	let target = select && select.target

	// initial case: hover is on unit cell
	if (Cell.equals(unit.cell, cell)) {
		path = [ unit.cell ]
	} else {
		// check if the selected square is walkable
		let square = range.squares.find(square => {
			return Cell.equals(square.cell, cell)
			    && (square.type === "move"
			    || square.type === "attack" && square.target)
		})
		if (square) {
			let dest = cell

			// if there's an enemy in this square
			// and no enemy is currently selected
			if (square.target && !target) {
				// create enemy preview component
				let unit = square.target
				let preview = Comps.Preview.create(unit, "topright", sprites)
				mode.comps.push(preview)

				// select enemy
				target = { unit, preview }
			}

			// if we're selecting an enemy,
			// but now the current square is empty
			// or houses a different unit than before
			if (target && (!square.target || target.unit !== square.target)) {
				// close enemy preview component
				Comps.Preview.exit(target.preview)

				// deselect enemy component
				target = null
			}

			// simple case: selecting nearby enemy
			if (!cpath && square.target && Unit.inRange(unit, cell)) {
				path = [ unit.cell ]
			} else {
				let rng = unit.wpn.rng
				if (square.target) {
					// if out of range
					if (!inRange(Cell.steps(cdest || unit.cell, cell), rng)) {
						// find closest square to attack from
						let neighbors = nbrhd(dest, rng)
							.filter(cell => range.squares.find(square => {
								return square.type === "move" && Cell.equals(square.cell, cell)
							}))
							.sort((a, b) => Cell.steps(a, unit.cell) - Cell.steps(b, unit.cell))
						dest = neighbors[0]
					} else if (!cpath) {
						// simple case: if no path is cached and the enemy is in range, we can just attack from the start cell
						path = [ unit.cell ]
					}
				}
				if (!path && dest && cpath) {
					if (!square.target || !inRange(Cell.steps(cdest, cell), rng)) {
						path = pathfind(unit, dest, map, cpath)
					} else {
						path = cpath
					}
				}
			}

			if (!path) {
				path = pathfind(unit, dest, map)
			}
		}
	}

	if (!select && (path || target)) {
		select = mode.select = {
			cursor: null,
			path: null,
			arrow: null,
			valid: false,
			target: null
		}
	}

	if (path) {
		if (!mode.select.cursor) {
			let pos = {
				x: cell.x * tilesize,
				y: cell.y * tilesize
			}
			select.cursor = {
				pos: pos,
				target: cell,
				cached: pos
			}
		} else {
			select.cursor.target = cell
		}
		select.valid = true
		select.arrow = sprites.Arrow(path, unit.control.faction)
		select.path = path
	} else if (mode.select) {
		select.valid = false
		select.cursor = null
	}

	if (target) {
		select.target = target
	} else if (select) {
		select.target = null
	}

	return false
}

function unhover(mode) {
	let target = mode.select && mode.select.target
	if (target) {
		Comps.Preview.exit(target.preview)
	}
	mode.select = null
}

function move(mode, path, target) {
	// close range component
	let rangecomp = mode.comps.find(comp => comp.id === "Range")
	if (rangecomp) {
		Comps.Range.exit(rangecomp)
	}

	// add piecemove animation
	if (path.length > 1) {
		let unit = mode.unit
		mode.anim.done = true
		mode.commands.push({ type: "move", unit, path })
		if (target) {
			mode.commands.push({ type: "forecast", unit, target })
		} else {
			mode.commands.push({ type: "endTurn", unit })
		}
	} else {
		mode.commands.push({ type: "cancel" })
	}
}
