import findRange from "./game/range"
import * as Map from "./game/map"
import * as Unit from "./game/unit"
import * as Game from "./game"
import * as Cell from "../lib/cell"
import pathfind from "../lib/pathfind"
import renderMap from "./view/map"
import renderUnitPreview from "./view/unit-preview"
import anims from "./anims"
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
		state: {
			consecs: [],
			concurs: [],
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
				pressed: null,
				offset: null
			}
		},
		cache: {
			map: null,
			selection: null,
			camera: { x: 0, y: 0 },
			cursor: null
		},
		range: null,
		game: null
	}
}

export function init(view, game) {
	let state = view.state
	let cache = view.cache
	let sprites = view.sprites
	let { camera, pointer } = state

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
			pointer.pos = getPosition(event)
			if (!pointer.pos) return false
			pointer.clicking = true
			pointer.pressed = pointer.pos
			pointer.offset = {
				x: camera.pos.x * view.scale,
				y: camera.pos.y * view.scale
			}
			if (state.selection) {
				let unit = state.selection.unit
				let cursor = snapToGrid(pointer.pos)
				let square = null
				if (game.phase.pending.includes(unit)) {
					square = cache.range.squares.find(({ cell }) => Cell.equals(cell, cursor))
				}
				if (square) {
					let path = pathfind(unit.cell, cursor, {
						width: map.width,
						height: map.height,
						blacklist: map.units
							.filter(other => !Unit.allied(unit, other))
							.map(unit => unit.cell)
					})
					cache.cursor = cursor
					cache.arrow = sprites.Arrow(path, unit.faction)
					cache.path = path
				}
			}
		},
		move(event) {
			pointer.pos = getPosition(event)
			if (!pointer.pos || !pointer.pressed) return
			let cursor = pointer.pos
			if (pointer.clicking) {
				let origin = pointer.pressed
				if (Cell.distance(origin, cursor) > 3) {
					pointer.clicking = false
				}
			}

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
		},
		release(event) {
			if (!pointer.pressed) return false
			if (pointer.clicking) {
				pointer.clicking = false
				let cursor = snapToGrid(pointer.pressed)
				let unit = Map.unitAt(map, cursor)
				if (state.selection) {
					let unit = state.selection.unit
					let square = null
					if (cache.range && game.phase.pending.includes(unit)) {
						square = cache.range.squares.find(({ cell }) => Cell.equals(cell, cursor))
					}
					if (square && square.type === "move") {
						move(unit, cursor)
					} else if (!animating(state.concurs, "PreviewEnter")
					&& !animating(state.concurs, "PieceMove")) {
						deselect()
					}
				} else if (unit
				&& !animating(state.concurs, "PreviewExit")
				&& !animating(state.concurs, "PieceMove")
				) {
					select(unit)
				}
			}
			pointer.pressed = null
		}
	}

	function select(unit) {
		let range = findRange(unit, map)
		let preview = renderUnitPreview(unit, sprites)
		let expand = anims.RangeExpand.create(range)
		let enter = anims.PreviewEnter.create()
		let lift = anims.PieceLift.create()
		state.concurs.push(expand, enter, lift)
		state.selection = { unit }
		cache.selection = {
			unit: unit,
			anim: lift
		}
		cache.preview = {
			image: preview,
			anim: enter
		}
		cache.range = expand.range
	}

	function deselect() {
		cache.selection.anim.done = true
		if (cache.range) {
			let shrink = anims.RangeShrink.create(cache.range)
			state.concurs.push(shrink)
		}
		if (cache.preview) {
			let exit = anims.PreviewExit.create(cache.preview.anim.x)
			cache.preview.anim = exit
			state.concurs.push(exit)
		}
		if (cache.selection) {
			let drop = anims.PieceDrop.create(cache.selection.anim.y)
			state.concurs.push(drop)
			cache.selection.anim = drop
		}
		state.selection = null
	}

	function move(unit, cursor) {
		if (cache.range) {
			let shrink = anims.RangeShrink.create(cache.range)
			state.concurs.push(shrink)
		}
		if (cache.preview) {
			let exit = anims.PreviewExit.create(cache.preview.anim.x)
			cache.preview.anim = exit
			state.concurs.push(exit)
		}
		let move = anims.PieceMove.create(cache.path)
		cache.selection.anim.done = true
		cache.selection.anim = move
		cache.selection.path = cache.path
		state.concurs.push(move)
	}

	function update() {
		state.time++
		if (state.dirty) {
			state.dirty = false
			render(view)
		}

		camera.pos.x += (camera.target.x - camera.pos.x) / 4
		camera.pos.y += (camera.target.y - camera.pos.y) / 4

		if (Math.round(cache.camera.x) !== Math.round(camera.pos.x)
		|| Math.round(cache.camera.y) !== Math.round(camera.pos.y)) {
			cache.camera.x = camera.pos.x
			cache.camera.y = camera.pos.y
			state.dirty = true
		}

		for (let i = 0; i < state.concurs.length; i++) {
			let anim = state.concurs[i]
			anims[anim.type].update(anim)
			if (anim.done) {
				state.concurs.splice(i--, 1)
				// TODO: move these into actual hooks?
				if (anim.type === "RangeShrink") {
					cache.range = null
				} else if (anim.type === "PreviewExit") {
					cache.preview = null
				} else if (anim.type === "PieceDrop") {
					cache.selection = null
					cache.cursor = null
					cache.path = null
				} else if (anim.type === "PieceMove") {
					let unit = state.selection.unit
					Unit.move(unit, anim.cell, map)
					Game.endTurn(unit, game)
					state.selection = null
					cache.selection = null
					cache.cursor = null
					cache.path = null
				}
			}
			state.dirty = true
		}
		let anim = state.consecs[0]
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
	let context = canvas.getContext("2d")
	context.fillStyle = "black"
	context.fillRect(0, 0, canvas.width, canvas.height)

	let { camera, selection } = view.state
	let origin = {
		x: Math.round(view.width / 2 - cache.map.width / 2 + camera.pos.x),
		y: Math.round(view.height / 2 - cache.map.width / 2 + camera.pos.y)
	}

	let layers = {
		map: [],
		range: [],
		shadows: [],
		pieces: [],
		markers: [],
		selection: [],
		ui: []
	}

	layers.map.push({ image: cache.map, x: origin.x, y: origin.y })

	if (cache.range) {
		let range = cache.range
		for (let square of range.squares) {
			let sprite = sprites.squares[square.type]
			let x = origin.x + square.cell.x * tilesize
			let y = origin.y + square.cell.y * tilesize
			layers.range.push({ image: sprite, x, y })
		}
	}

	let game = view.game
	if (cache.cursor) {
		let sprite = sprites.select.cursor[game.phase.faction]
		let cell = cache.cursor
		let x = origin.x + cell.x * tilesize
		let y = origin.y + cell.y * tilesize
		if (!cache.selection.path) {
			layers.selection.push({ image: sprite, x, y })
		}
	}

	if (cache.path) {
		for (let node of cache.arrow) {
			let image = node.image
			let x = origin.x + node.x
			let y = origin.y + node.y
			if (!cache.selection.path || state.time % 2) {
				layers.markers.push({ image, x, y })
			}
		}
	}

	for (let unit of game.map.units) {
		let sprite = sprites.pieces[unit.faction][unit.type]
		let cell = unit.cell
		let x = origin.x + cell.x * tilesize
		let y = origin.y + cell.y * tilesize
		let z = 0
		let layer = "pieces"
		if (game.phase.faction === unit.faction) {
			if (game.phase.pending.includes(unit)) {
				if (!cache.selection || cache.selection.unit !== unit) {
					let glow = sprites.select.glow[unit.faction]
					layers.pieces.push({ image: glow, x, y: y - 2, z })
				}
			} else {
				sprite = sprites.pieces.done[unit.faction][unit.type]
			}
		}
		if (cache.selection && cache.selection.unit === unit) {
			layer = "selection"
			if (!cache.selection.path || state.time % 2) {
				let ring = sprites.select.ring[unit.faction]
				layers.markers.push({ image: ring, x: x - 2, y: y - 3, z: -1 })
			}
			if (cache.selection.path) {
				let anim = cache.selection.anim
				x = origin.x + anim.cell.x * tilesize
				y = origin.y + anim.cell.y * tilesize
			} else {
				z = Math.round(cache.selection.anim.y)
			}
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

	if (cache.preview) {
		let preview = cache.preview
		const margin = 4
		let x = Math.round(lerp(-preview.image.width, margin, preview.anim.x))
		let y = view.height - preview.image.height + 1 - margin
		layers.ui.push({ image: preview.image, x, y })
	}

	for (let layername in layers) {
		let layer = layers[layername]
		layer.sort(zsort)
		for (let node of layer) {
			let x = Math.round(node.x)
			let y = Math.round(node.y - (node.z || 0))
			context.drawImage(node.image, x, y)
		}
	}
}

function zsort(a, b) {
	return (a.y + a.image.height / 2) - (b.y + b.image.height / 2)
}
