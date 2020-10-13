// import findRange from "./game/range"
// import * as Map from "./game/map"
// import * as Unit from "./game/unit"
// import * as Game from "./game"
// import * as Cell from "../lib/cell"
// import * as Canvas from "../lib/canvas"
// import rgb from "../lib/rgb"
// import pathfind from "../lib/pathfind"
// import Anims from "./anims"
import screens from "../screens"
import drawNodes from "./draw-nodes"

export function create(width, height, sprites) {
	return {
		native: { width, height },
		width: window.innerWidth,
		height: window.innerHeight,
		scale: 1,
		sprites: sprites,
		element: document.createElement("canvas"),
		state: {
			time: 0,
			dirty: false,
			screen: null,
			nodes: [],
			anims: [],
			pointer: {
				pos: null,
				pressed: null,
				mode: null,
				time: 0
			},
			camera: {
				pos: { x: 0, y: 0 },
				vel: { x: 0, y: 0 },
				target: { x: 0, y: 0 }
			}
		},
		cache: {
			camera: { x: 0, y: 0 }
		}
	}
}

export function init(view, game) {
	let state = view.state
	let cache = view.cache
	let sprites = view.sprites
	let { camera, pointer, anims } = state

	state.screen = screens.Game.init(game, sprites)

	function onresize() {
		let scaleX = Math.max(1, Math.floor(window.innerWidth / view.native.width))
		let scaleY = Math.max(1, Math.floor(window.innerHeight / view.native.height))
		view.scale = Math.min(scaleX, scaleY)
		view.width = Math.ceil(window.innerWidth / view.scale)
		view.height = Math.ceil(window.innerHeight / view.scale)

		let canvas = view.element
		canvas.width = view.width
		canvas.height = view.height
		canvas.style.transform = `scale(${ view.scale })`
	}

	let device = null
	let events = {
		resize() {
			onresize()
			state.dirty = true
		},
		press(event) {
			if (!device) {
				device = switchDevice(event)
			}
			if (pointer.pressed) return false
			if (anims.find(anim => anim.blocking)) {
				return false
			}
			pointer.time = state.time
			pointer.pos = getPosition(event)
			if (!pointer.pos) return false

			pointer.mode = "click"
			pointer.pressed = pointer.pos
			let cursor = snapToGrid(pointer.pos)
			pointer.unit = Map.unitAt(map, cursor)
			if (state.mode !== "select") return true
			pointer.offset = {
				x: camera.pos.x * view.scale,
				y: camera.pos.y * view.scale
			}
			if (!state.select) return
			let select = state.select
			let unit = select.unit
			// if unit hasn't moved, we can
			// start unit drag
			if (game.phase.pending.includes(unit)) {
				let selecting = actions.hover(cursor)
				if (selecting) {
					pointer.select = true
				}
			}
		},
		move(event) {
			pointer.pos = getPosition(event)
			if (!pointer.pos || !pointer.pressed) return
			if (pointer.clicking) {
				let cursor = pointer.pos
				let origin = pointer.pressed
				if (Cell.distance(origin, cursor) > 4) {
					pointer.clicking = false
					pointer.unit = false
				}
			}
			if (anims.find(anim => anim.blocking) || state.mode !== "select") {
				return
			}
			if (!pointer.select) {
				actions.panCamera(camera, pointer)
				return
			}
			let cursor = snapToGrid(pointer.pos)
			if (!Cell.equals(pointer.select, cursor)) {
				actions.hover(cursor)
			}
		},
		release(event) {
			if (!pointer.pressed) return false
			if (anims.find(anim => anim.blocking)) {
				return
			}
			if (state.mode === "attack") {
				Unit.move(state.select.unit, state.select.src, map)
				cache.forecast = null
				cache.range = null
				state.mode = "select"
				state.dirty = true
				state.select = null
				state.target = null
			} else {
				let cursor = null
				if (pointer.clicking) {
					cursor = snapToGrid(pointer.pressed)
				}
				if (pointer.select) {
					cursor = snapToGrid(pointer.pos)
				}
				if (cursor) {
					let unit = Map.unitAt(map, cursor)
					if (state.select) {
						let select = state.select
						let unit = select.unit
						let square = null
						if (cache.range && game.phase.pending.includes(unit)) {
							square = cache.range.squares.find(({ cell }) => Cell.equals(cell, cursor))
						}
						if (square && select.path) {
							actions.move(unit, cursor)
						} else if (pointer.clicking) {
							actions.deselect()
						} else {
							actions.unhover()
						}
					} else if (unit) {
						actions.select(unit)
					}
				}
			}
			pointer.clicking = false
			pointer.unit = null
			pointer.select = false
			pointer.pressed = null
		}
	}

	// let actions = {
	// 	select(unit) {
	// 		let range = findRange(unit, map)
	// 		let preview = renderPreview(unit, sprites)
	// 		let expand = Anims.RangeExpand.create(range)
	// 		let enter = Anims.PreviewEnter.create()
	// 		let lift = Anims.PieceLift.create()
	// 		state.anims.push(expand, enter, lift)
	// 		state.select = {
	// 			unit: unit,
	// 			anim: lift,
	// 			path: null,
	// 			arrow: null,
	// 			cursor: null,
	// 			valid: false
	// 		}
	// 		cache.range = expand.range
	// 		cache.playerview = {
	// 			image: preview,
	// 			anim: enter
	// 		}
	// 		if (!pointer.select && game.phase.pending.includes(unit)) {
	// 			actions.centerCamera(unit.cell)
	// 		}
	// 	},
	// 	deselect() {
	// 		if (!state.select) return false
	// 		let select = state.select
	// 		select.anim.done = true
	// 		if (cache.range) {
	// 			let shrink = Anims.RangeShrink.create(cache.range)
	// 			state.anims.push(shrink)
	// 		}
	// 		if (cache.playerview) {
	// 			let exit = Anims.PreviewExit.create(cache.playerview.anim.x, "playerview")
	// 			cache.playerview.anim.done = true
	// 			cache.playerview.anim = exit
	// 			state.anims.push(exit)
	// 		}
	// 		if (cache.enemyview) {
	// 			let exit = Anims.PreviewExit.create(cache.enemyview.anim.x, "enemyview")
	// 			cache.enemyview.anim.done = true
	// 			cache.enemyview.anim = exit
	// 			state.anims.push(exit)
	// 			state.target = null
	// 		}
	// 		let drop = Anims.PieceDrop.create(select.anim.y)
	// 		state.anims.push(drop)
	// 		select.anim = drop
	// 	},
	// 	hover(cell) {
	// 		let select = state.select
	// 		let unit = select.unit
	// 		if (select.cursor && Cell.equals(select.cursor.target, cell)) {
	// 			return false
	// 		}
	// 		let square = cache.range.squares.find(square => {
	// 			return Cell.equals(square.cell, cell)
	// 			    && (square.type === "move" || square.type === "attack" && square.target)
	// 		})
	// 		let path = null
	// 		if (square) {
	// 			let target = cell
	// 			let opts = {
	// 				width: map.width,
	// 				height: map.height,
	// 				blacklist: map.units // make enemy units unwalkable
	// 					.filter(other => !Unit.allied(unit, other))
	// 					.map(unit => unit.cell)
	// 			}
	// 			// if there's an enemy in this square
	// 			// (and no enemy is currently selected)
	// 			if (square.target && !cache.enemyview) {
	// 				// select enemy
	// 				let unit = square.target
	// 				let preview = renderPreview(unit, sprites)
	// 				let enter = Anims.PreviewEnter.create()
	// 				cache.enemyview = {
	// 					image: preview,
	// 					unit: unit,
	// 					anim: enter
	// 				}
	// 				state.anims.push(enter)
	// 				state.target = unit
	// 			}
	// 			// if we were selecting an enemy,
	// 			// but now the current square is empty
	// 			// or houses a different unit than before
	// 			if (cache.enemyview
	// 			&& (!square.target || square.target !== cache.enemyview.unit)
	// 			) {
	// 				// deselect enemy
	// 				let exit = Anims.PreviewExit.create(cache.enemyview.anim.x, "enemyview")
	// 				cache.enemyview.anim.done = true
	// 				cache.enemyview.anim = exit
	// 				state.anims.push(exit)
	// 				state.target = null
	// 			}
	// 			// valid if tapping an adjacent enemy to attack
	// 			if (square.target && !select.path && Cell.adjacent(unit.cell, target)) {
	// 				path = [ unit.cell ]
	// 			} else {
	// 				let prev = select.path
	// 					? select.path[select.path.length - 1]
	// 					: unit.cell
	// 				let range = Unit.rng(unit)
	// 				if (square.type === "attack") {
	// 					// if out of range
	// 					if (Cell.distance(prev, cell) > range) {
	// 						// prep closest attacking square for pathfinding
	// 						let neighbors = Cell.neighborhood(cell, range)
	// 							.filter(cell => !map.units.find(unit => Cell.equals(cell, unit.cell)))
	// 							.sort((a, b) =>
	// 								Cell.distance(a, unit.cell) - Cell.distance(b, unit.cell)
	// 							)
	// 						target = neighbors[0]
	// 					} else if (!select.path) {
	// 						// valid if tapping an enemy in range to attack
	// 						path = [ unit.cell ]
	// 					}
	// 				}
	// 				// if we still don't have a path,
	// 				// the square covers one of three cases:
	// 				// 1. it's an attack target, but out of range
	// 				// 2. it's a move target, and we have a cached path to build off of
	// 				// 3. it's a move target, and we don't have a cached path
	// 				// the below conditional covers cases (1) and (2).
	// 				if (!path && target && select.path) {
	// 					let cached = select.path
	// 					let prev = cached[cached.length - 1]
	// 					if (square.type !== "attack" || Cell.distance(prev, cell) > range) {
	// 						let addendum = pathfind(prev, target, opts)
	// 						for (let i = addendum.length; --i >= 1;) {
	// 							for (let j = 0; j < cached.length; j++) {
	// 								if (Cell.equals(addendum[i], cached[j])) {
	// 									path = cached.slice(0, j).concat(addendum.slice(i))
	// 									break
	// 								}
	// 							}
	// 							if (path) {
	// 								break
	// 							}
	// 						}
	// 						if (!path) {
	// 							let backtrack = cached.find(cell => Cell.equals(cell, target))
	// 							let length = cached.length + addendum.length - 2
	// 							if (backtrack) {
	// 								path = cached.slice(0, cached.indexOf(backtrack) + 1)
	// 							} else if (length <= Unit.mov(unit)) {
	// 								path = cached.concat(addendum.slice(1))
	// 							}
	// 						}
	// 					} else {
	// 						// is an attack square but in range;
	// 						// use cached path
	// 						path = cached
	// 					}
	// 				}
	// 			}
	// 			// case (3): no path yet. just do a full pathfind
	// 			if (!path) {
	// 				path = pathfind(unit.cell, target, opts)
	// 			}
	// 			if (path) {
	// 				if (!select.cursor) {
	// 					select.cursor = {
	// 						pos: { x: cell.x * tilesize, y: cell.y * tilesize },
	// 						target: cell
	// 					}
	// 				} else {
	// 					select.cursor.target = cell
	// 				}
	// 				select.arrow = sprites.Arrow(path, unit.faction)
	// 				select.path = path
	// 				select.valid = true
	// 				return true
	// 			}
	// 		}
	// 		if (!path) {
	// 			if (select.cursor) {
	// 				select.cursor = null
	// 				// select.cursor.target = cell
	// 			}
	// 			// select.arrow = null
	// 			// select.path = null
	// 			select.valid = false
	// 			return false
	// 		}
	// 	},
	// 	unhover() {
	// 		let select = state.select
	// 		select.cursor = null
	// 		select.arrow = null
	// 		select.path = null
	// 		select.valid = false
	// 	},
	// 	move(unit, cursor) {
	// 		if (!state.select) return false
	// 		let select = state.select
	// 		if (cache.range) {
	// 			let shrink = Anims.RangeShrink.create(cache.range)
	// 			state.anims.push(shrink)
	// 		}
	// 		if (select.path) {
	// 			let move = Anims.PieceMove.create(select.path)
	// 			select.anim.done = true
	// 			select.anim = move
	// 			state.anims.push(move)
	// 		}
	// 		state.select.src = state.select.unit.cell
	// 		state.select.dest = select.path[select.path.length - 1]
	// 		if (pointer.clicking) {
	// 			camera.follow = true
	// 		} else {
	// 			actions.centerCamera(cursor)
	// 		}
	// 	},
	// 	panCamera(camera, pointer) {
	// 		camera.target.x = (pointer.pos.x - pointer.pressed.x + pointer.offset.x) / view.scale
	// 		camera.target.y = (pointer.pos.y - pointer.pressed.y + pointer.offset.y) / view.scale
	//
	// 		let left = view.width / 2
	// 		let right = -view.width / 2
	// 		let top = view.height / 2
	// 		let bottom = -view.height / 2
	// 		if (camera.target.x > left) {
	// 			camera.target.x = left
	// 		} else if (camera.target.x < right) {
	// 			camera.target.x = right
	// 		}
	// 		if (camera.target.y > top) {
	// 			camera.target.y = top
	// 		} else if (camera.target.y < bottom) {
	// 			camera.target.y = bottom
	// 		}
	// 	},
	// 	centerCamera(cell) {
	// 		camera.focus = cell
	// 		camera.target.x = cache.map.width / 2 - (cell.x + 0.5) * tilesize
	// 		camera.target.y = cache.map.height / 2 - (cell.y + 0.5) * tilesize
	// 	}
	// }

	function update() {
		state.time++
		if (state.dirty) {
			state.dirty = false
			render(view)
		}
	}
	//
	// 	if (!state.select && !pointer.select && pointer.unit && state.time - pointer.time === 20) {
	// 		if (game.phase.pending.includes(pointer.unit)) {
	// 			pointer.select = true
	// 		}
	// 		actions.select(pointer.unit)
	// 	}
	//
	// 	// center camera on moving pieces
	// 	if (camera.follow && state.select && state.select.anim.type === "PieceMove") {
	// 		let anim = state.select.anim
	// 		actions.centerCamera(anim.cell)
	// 	}
	//
	// 	// rerender if camera is at least a pixel off from its drawn position
	// 	if (Math.round(cache.camera.x) !== Math.round(camera.pos.x)
	// 	|| Math.round(cache.camera.y) !== Math.round(camera.pos.y)) {
	// 		cache.camera.x = camera.pos.x
	// 		cache.camera.y = camera.pos.y
	// 		state.dirty = true
	// 	}
	//
	// 	// update camera position
	// 	camera.pos.x += camera.vel.x
	// 	camera.pos.y += camera.vel.y
	// 	camera.vel.x += ((camera.target.x - camera.pos.x) / 8 - camera.vel.x) / 2
	// 	camera.vel.y += ((camera.target.y - camera.pos.y) / 8 - camera.vel.y) / 2
	//
	// 	// update cursor
	// 	if (state.select && state.select.cursor) {
	// 		let cursor = state.select.cursor
	// 		if (Math.round(cache.cursor.x) !== Math.round(cursor.pos.x)
	// 		|| Math.round(cache.cursor.y) !== Math.round(cursor.pos.y)) {
	// 			cache.cursor.x = cursor.pos.x
	// 			cache.cursor.y = cursor.pos.y
	// 			state.dirty = true
	// 		}
	// 		cursor.pos.x += (cursor.target.x * tilesize - cursor.pos.x) / 4
	// 		cursor.pos.y += (cursor.target.y * tilesize - cursor.pos.y) / 4
	// 	}
	//
	// 	// handle animations
	// 	for (let i = 0; i < state.anims.length; i++) {
	// 		let anim = state.anims[i]
	// 		if (anim.done) {
	// 			state.anims.splice(i--, 1)
	// 			// TODO: move these into actual hooks?
	// 			// probably pass fns into anim data arg
	// 			// and call from here if existent
	// 			if (anim.type === "RangeShrink") {
	// 				if (!state.anims.find(anim => anim.type === "RangeExpand")) {
	// 					cache.range = null
	// 				}
	// 			} else if (anim.type === "PreviewExit") {
	// 				cache[anim.id] = null
	// 			} else if (anim.type === "PieceDrop") {
	// 				state.select = null
	// 			} else if (anim.type === "PieceMove") {
	// 				if (cache.playerview) {
	// 					let exit = Anims.PreviewExit.create(cache.playerview.anim.x, "playerview")
	// 					cache.playerview.anim.done = true
	// 					cache.playerview.anim = exit
	// 					state.anims.push(exit)
	// 				}
	// 				if (cache.enemyview) {
	// 					let exit = Anims.PreviewExit.create(cache.enemyview.anim.x, "enemyview")
	// 					cache.enemyview.anim.done = true
	// 					cache.enemyview.anim = exit
	// 					state.anims.push(exit)
	// 				}
	// 				let unit = state.select.unit
	// 				state.select.anim = null
	// 				if (camera.follow) {
	// 					camera.follow = false
	// 				}
	// 				Unit.move(unit, state.select.dest, map)
	// 				if (!state.target) {
	// 					Game.endTurn(unit, game)
	// 					state.select = null
	// 				} else {
	// 					state.mode = "attack"
	//
	// 					let lift = Anims.PieceLift.create()
	// 					let enter = Anims.EaseOut.create(15)
	// 					state.anims.push(enter, lift)
	// 					state.select.path = null
	// 					state.select.anim = lift
	//
	// 					let attacker = state.select.unit
	// 					let defender = state.target
	// 					let range = {
	// 						center: attacker.cell,
	// 						range: Unit.rng(attacker),
	// 						squares: Cell.neighborhood(attacker.cell, Unit.rng(attacker))
	// 							.map(cell => ({ cell, type: "attack" }))
	// 					}
	// 					let expand = Anims.RangeExpand.create(range)
	// 					state.anims.push(expand)
	// 					cache.range = expand.range
	// 				}
	// 			}
	// 		}
	// 		Anims[anim.type].update(anim)
	// 		state.dirty = true
	// 	}
	// 	requestAnimationFrame(update)
	// }

	events.resize()
	window.addEventListener("resize", events.resize)
	// window.addEventListener("mousedown", events.press)
	// window.addEventListener("mousemove", events.move)
	// window.addEventListener("mouseup", events.release)
	// window.addEventListener("touchstart", events.press)
	// window.addEventListener("touchmove", events.move)
	// window.addEventListener("touchend", events.release)
	requestAnimationFrame(update)

	function switchDevice(event) {
		let device = "desktop"
		if (event.touches) {
			device = "mobile"
			window.removeEventListener("mousedown", events.press)
			window.removeEventListener("mousemove", events.move)
			window.removeEventListener("mouseup", events.release)
		} else {
			window.removeEventListener("touchstart", events.press)
			window.removeEventListener("touchmove", events.move)
			window.removeEventListener("touchend", events.release)
		}
		return device
	}

	// getPosition(event) -> pos
	// > determines the pointer position from a given event.
	// > detects both clicks and taps
	function getPosition(event) {
		let x = event.pageX || event.touches && event.touches[0].pageX
		let y = event.pageY || event.touches && event.touches[0].pageY
		if (x === undefined || y === undefined) return null
		return { x, y }
	}

	// snapToGrid(pos) -> cell
	// > gets the grid cell indicated by
	// > a given real onscreen coord
	function snapToGrid(pos) {
		let map = game.map
		// undo scaling
		let realpos = {
			x: (pos.x - window.innerWidth / 2) / view.scale,
			y: (pos.y - window.innerHeight / 2) / view.scale,
		}
		// relative to top left corner of map
		let gridpos = {
			x: realpos.x + map.width * tilesize / 2 - camera.pos.x,
			y: realpos.y + map.height * tilesize / 2 - camera.pos.y,
		}
		// fix to tiles
		return {
			x: Math.floor(gridpos.x / tilesize),
			y: Math.floor(gridpos.y / tilesize)
		}
	}
}

export function render(view) {
	let state = view.state
	let nodes = state.nodes

	// clear canvas
	let canvas = view.element
	let context = canvas.getContext("2d")
	context.fillStyle = "black"
	context.fillRect(0, 0, canvas.width, canvas.height)

	// clear node list
	nodes.length = 0

	// queue nodes
	let screennodes = screens[state.screen.id].render(state.screen, view)
	nodes.push(...screennodes)

	drawNodes(nodes, view)
}
