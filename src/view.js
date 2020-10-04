import findRange from "./game/range"
import * as Map from "./game/map"
import * as Unit from "./game/unit"
import * as Game from "./game"
import * as Cell from "../lib/cell"
import pathfind from "../lib/pathfind"
import renderMap from "./view/map"
import renderUnitPreview from "./view/unit-preview"
import Anims from "./anims"
import lerp from "lerp"
const tilesize = 16

export function create(width, height, sprites) {
	return {
		native: { width, height },
		width: window.innerWidth,
		height: window.innerHeight,
		scale: 1,
		sprites: sprites,
		element: document.createElement("canvas"),
		game: null,
		state: {
			anims: [],
			time: 0,
			dirty: false,
			camera: {
				pos: { x: 0, y: 0 },
				target: { x: 0, y: 0 }
			},
			selection: null,
			pointer: {
				pos: null,
				clicking: false,
				select: false,
				pressed: null,
				offset: null
			}
		},
		cache: {
			map: null,
			camera: { x: 0, y: 0 }
		},
		layers: {
			map: [],
			range: [],
			shadows: [],
			pieces: [],
			markers: [],
			selection: [],
			mirage: [],
			ui: []
		}
	}
}

export function init(view, game) {
	let state = view.state
	let cache = view.cache
	let sprites = view.sprites
	let { camera, pointer, anims } = state

	let map = game.map
	view.game = game
	view.cache.map = renderMap(map, tilesize, sprites.palette)

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
				return
			}
			pointer.pos = getPosition(event)
			if (!pointer.pos) return false
			pointer.clicking = true
			pointer.pressed = pointer.pos
			pointer.offset = {
				x: camera.pos.x * view.scale,
				y: camera.pos.y * view.scale
			}
			let select = state.select
			if (!select) return
			let unit = select.unit
			let cursor = snapToGrid(pointer.pos)
			let square = null
			// if unit hasn't moved yet
			if (game.phase.pending.includes(unit)) {
				// check if the user is selecting a square
				actions.hover(cursor)
				pointer.select = true
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
				}
			}
			if (anims.find(anim => anim.blocking)) {
				return
			}
			if (!pointer.select) {
				actions.pan(camera, pointer)
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
					if (square && square.type === "move") {
						actions.move(unit, cursor)
					} else if (pointer.clicking && !anims.find(anim => anim.blocking)) {
						actions.deselect()
					}
				} else if (unit && !anims.find(anim => anim.blocking)) {
					actions.select(unit)
				}
			}
			pointer.clicking = false
			pointer.select = false
			pointer.pressed = null
		}
	}

	let actions = {
		select(unit) {
			let range = findRange(unit, map)
			let preview = renderUnitPreview(unit, sprites)
			let expand = Anims.RangeExpand.create(range)
			let enter = Anims.PreviewEnter.create()
			let lift = Anims.PieceLift.create()
			state.anims.push(expand, enter, lift)
			state.select = {
				unit: unit,
				anim: lift,
				path: null,
				arrow: null,
				cursor: null,
				valid: false
			}
			cache.range = expand.range
			cache.preview = {
				image: preview,
				anim: enter
			}
		},
		hover(cell) {
			let select = state.select
			let unit = select.unit
			let square = cache.range.squares.find(square => {
				return square.type === "move" && Cell.equals(square.cell, cell)
			})
			if (square) {
				let path = pathfind(unit.cell, cell, {
					width: map.width,
					height: map.height,
					blacklist: map.units // make enemy units unwalkable
						.filter(other => !Unit.allied(unit, other))
						.map(unit => unit.cell)
				})
				select.cursor = cell
				select.arrow = sprites.Arrow(path, unit.faction)
				select.path = path
				select.valid = true
			} else {
				select.valid = false
			}
		},
		deselect() {
			if (!state.select) return false
			let select = state.select
			select.anim.done = true
			if (cache.range) {
				let shrink = Anims.RangeShrink.create(cache.range)
				state.anims.push(shrink)
			}
			if (cache.preview) {
				let exit = Anims.PreviewExit.create(cache.preview.anim.x)
				cache.preview.anim.done = true
				cache.preview.anim = exit
				state.anims.push(exit)
			}
			let drop = Anims.PieceDrop.create(select.anim.y)
			state.anims.push(drop)
			select.anim = drop
		},
		move(unit, cursor) {
			if (!state.select) return false
			let select = state.select
			if (cache.range) {
				let shrink = Anims.RangeShrink.create(cache.range)
				state.anims.push(shrink)
			}
			if (select.path) {
				let move = Anims.PieceMove.create(select.path)
				select.anim.done = true
				select.anim = move
				state.anims.push(move)
			}
		},
		pan(camera, pointer) {
			camera.target.x = (pointer.pos.x - pointer.pressed.x + pointer.offset.x) / view.scale
			camera.target.y = (pointer.pos.y - pointer.pressed.y + pointer.offset.y) / view.scale

			let left = view.width / 2
			let right = -view.width / 2
			let top = view.height / 2
			let bottom = -view.height / 2
			if (camera.target.x > left) {
				camera.target.x = left
			} else if (camera.target.x < right) {
				camera.target.x = right
			}
			if (camera.target.y > top) {
				camera.target.y = top
			} else if (camera.target.y < bottom) {
				camera.target.y = bottom
			}
		}
	}

	function update() {
		state.time++
		if (state.dirty) {
			state.dirty = false
			render(view)
		}

		if (state.select && state.select.anim.type === "PieceMove") {
			let anim = state.select.anim
			camera.target.x = cache.map.width / 2 - (anim.cell.x + 0.5) * tilesize
			camera.target.y = cache.map.height / 2 - (anim.cell.y + 0.5) * tilesize
			console.log(anim)
		}

		camera.pos.x += (camera.target.x - camera.pos.x) / 4
		camera.pos.y += (camera.target.y - camera.pos.y) / 4

		if (Math.round(cache.camera.x) !== Math.round(camera.pos.x)
		|| Math.round(cache.camera.y) !== Math.round(camera.pos.y)) {
			cache.camera.x = camera.pos.x
			cache.camera.y = camera.pos.y
			state.dirty = true
		}

		for (let i = 0; i < state.anims.length; i++) {
			let anim = state.anims[i]
			if (anim.done) {
				state.anims.splice(i--, 1)
				// TODO: move these into actual hooks?
				if (anim.type === "RangeShrink") {
					cache.range = null
				} else if (anim.type === "PreviewExit") {
					cache.preview = null
				} else if (anim.type === "PieceDrop") {
					state.select = null
				} else if (anim.type === "PieceMove") {
					if (cache.preview) {
						let exit = Anims.PreviewExit.create(cache.preview.anim.x)
						cache.preview.anim.done = true
						cache.preview.anim = exit
						state.anims.push(exit)
					}
					let unit = state.select.unit
					Unit.move(unit, anim.cell, map)
					Game.endTurn(unit, game)
					state.select = null
				}
			}
			Anims[anim.type].update(anim)
			state.dirty = true
		}
		requestAnimationFrame(update)
	}

	function animating(anims, type) {
		if (!type) return !!anims.length
		for (let anim of anims) {
			if (anim.type === type) {
				return true
			}
		}
		return false
	}

	events.resize()
	window.addEventListener("resize", events.resize)
	window.addEventListener("mousedown", events.press)
	window.addEventListener("mousemove", events.move)
	window.addEventListener("mouseup", events.release)
	window.addEventListener("touchstart", events.press)
	window.addEventListener("touchmove", events.move)
	window.addEventListener("touchend", events.release)
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

	// diagnoses the pointer position from an event.
	// detects both clicks and taps
	function getPosition(event) {
		let x = event.pageX || event.touches && event.touches[0].pageX
		let y = event.pageY || event.touches && event.touches[0].pageY
		if (x === undefined || y === undefined) return null
		return { x, y }
	}

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
	let sprites = view.sprites
	let palette = sprites.palette
	let state = view.state
	let cache = view.cache
	let canvas = view.element
	let layers = view.layers
	let game = view.game
	let context = canvas.getContext("2d")
	context.fillStyle = "black"
	context.fillRect(0, 0, canvas.width, canvas.height)

	// find top left corner of grid for drawing grid-bound elements
	let { camera, pointer, select } = state
	let origin = findOrigin(view)

	// clear layers
	for (let name in layers) {
		layers[name].length = 0
	}

	// queue map
	layers.map.push({ image: cache.map, x: origin.x, y: origin.y })

	// queue range
	if (cache.range) {
		for (let square of cache.range.squares) {
			let sprite = sprites.squares[square.type]
			let x = origin.x + square.cell.x * tilesize
			let y = origin.y + square.cell.y * tilesize
			layers.range.push({ image: sprite, x, y })
		}
	}

	// queue cursor
	if (select && select.cursor
	&& select.anim.type !== "PieceMove") {
		let sprite = sprites.select.cursor[game.phase.faction]
		let x = origin.x + select.cursor.x * tilesize - 1
		let y = origin.y + select.cursor.y * tilesize - 1
		layers.selection.push({ image: sprite, x, y })
	}

	// queue arrow
	if (select && select.path
	&& (select.anim.type !== "PieceMove" || state.time % 2)) {
		for (let node of select.arrow) {
			let image = node.image
			let x = origin.x + node.x
			let y = origin.y + node.y
			layers.markers.push({ image, x, y })
		}
	}

	// queue units
	for (let unit of game.map.units) {
		let sprite = sprites.pieces[unit.faction][unit.type]
		let cell = unit.cell
		let x = origin.x + cell.x * tilesize
		let y = origin.y + cell.y * tilesize
		let z = 0
		let layer = null
		if (game.phase.faction === unit.faction) {
			if (game.phase.pending.includes(unit)) {
				if (!select || select.unit !== unit) {
					let glow = sprites.select.glow[unit.faction]
					layers.pieces.push({ image: glow, x, y: y - 2, z })
				}
			} else {
				sprite = sprites.pieces.done[unit.faction][unit.type]
			}
		}
		if (select && select.unit === unit) {
			let anim = select.anim
			if (anim.type !== "PieceMove" || state.time % 2) {
				let ring = sprites.select.ring[unit.faction]
				layers.markers.push({ image: ring, x: x - 2, y: y - 2, z: 0 })
			}
			if (anim.type === "PieceMove") {
				x = origin.x + anim.cell.x * tilesize
				y = origin.y + anim.cell.y * tilesize
			} else {
				z = Math.round(anim.y)
			}
			layer = "selection"
		} else {
			layer = "pieces"
		}
		layers[layer].push({
			image: sprite,
			x: x + 1,
			y: y - 1,
			z: z
		})
		layers.shadows.push({
			image: sprites.pieces.shadow,
			x: x + 1,
			y: y + 3
		})
	}

	// queue unit mirage
	if (pointer.select && select.valid) {
		let unit = select.unit
		let image = sprites.pieces[unit.faction][unit.type]
		let x = pointer.pos.x / view.scale - image.width / 2
		let y = pointer.pos.y / view.scale - image.height - 8
		layers.mirage.push({ image, x, y, opacity: 0.75 })
	}

	// queue unit preview
	if (cache.preview) {
		let preview = cache.preview
		const margin = 4
		let x = Math.round(lerp(-preview.image.width, margin, preview.anim.x))
		let y = view.height - preview.image.height + 1 - margin
		layers.ui.push({ image: preview.image, x, y })
	}

	// render layers
	for (let layername in layers) {
		let layer = layers[layername]
		layer.sort(zsort)
		for (let node of layer) {
			let image = node.image
			let x = Math.round(node.x)
			let y = Math.round(node.y - (node.z || 0))
			if (node.opacity !== undefined) {
				context.globalAlpha = node.opacity
				context.drawImage(image, x, y)
				context.globalAlpha = 1
			} else {
				context.drawImage(image, x, y)
			}
		}
	}
}

function zsort(a, b) {
	return (a.y + a.image.height / 2) - (b.y + b.image.height / 2)
}

function findOrigin(view) {
	return {
		x: view.width / 2 - view.cache.map.width / 2 + view.state.camera.pos.x,
		y: view.height / 2 - view.cache.map.width / 2 + view.state.camera.pos.y
	}
}
