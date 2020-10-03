import findRange from "./game/range"
import * as Map from "./game/map"
import * as Unit from "./game/unit"
import * as Cell from "../lib/cell"
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
			camera: { x: 0, y: 0 },
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
			selection: null
		},
		range: null,
		app: null
	}
}

export function init(view, app) {
	let state = view.state
	let cache = view.cache
	let sprites = view.sprites
	let { camera, pointer } = state

	let map = app.map
	view.app = app
	view.cache.map = renderMap(map, tilesize)

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
			let cursor = snapToGrid(pointer.pos)
			pointer.clicking = true
			pointer.pressed = pointer.pos
			pointer.offset = {
				x: camera.x * view.scale,
				y: camera.y * view.scale
			}
		},
		move(event) {
			pointer.pos = getPosition(event)
			if (!pointer.pos || !pointer.pressed) return
			let cursor = pointer.pos
			if (pointer.clicking) {
				let origin = pointer.pressed
				if (!Cell.equals(origin, cursor)) {
					pointer.clicking = false
				}
			}
			camera.x = (pointer.pos.x - pointer.pressed.x + pointer.offset.x) / view.scale
			camera.y = (pointer.pos.y - pointer.pressed.y + pointer.offset.y) / view.scale
			let left = view.width / 2
			let right = -view.width / 2
			let top = view.height / 2
			let bottom = -view.height / 2
			if (camera.x > left) {
				camera.x = left
			} else if (camera.x < right) {
				camera.x = right
			}
			if (camera.y > top) {
				camera.y = top
			} else if (camera.y < bottom) {
				camera.y = bottom
			}
			view.state.dirty = true
		},
		release(event) {
			if (!pointer.pressed) return false
			if (pointer.clicking) {
				pointer.clicking = false
				let cursor = snapToGrid(pointer.pressed)
				let unit = Map.unitAt(app.map, cursor)
				if (state.selection) {
					deselect()
				} else if (unit) {
					select(unit)
				}
			}
			pointer.pressed = null
		}
	}

	function select(unit) {
		let animating = false
		for (let i = 0; i < state.concurs.length; i++) {
			let anim = state.concurs[i]
			if (anim.type === "PreviewExit") {
				animating = true
				break
			}
		}
		if (animating) return
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
		let animating = false
		for (let i = 0; i < state.concurs.length; i++) {
			let anim = state.concurs[i]
			if (anim.type === "PreviewEnter") {
				animating = true
				break
			}
		}
		if (animating) return
		let shrink = anims.RangeShrink.create(cache.range)
		let exit = anims.PreviewExit.create(cache.preview.anim.x)
		let drop = anims.PieceDrop.create(cache.selection.anim.y)
		state.concurs.push(shrink, exit, drop)
		cache.preview.anim = exit
		cache.selection.anim = drop
		state.selection = null
	}

	function update() {
		state.time++
		if (state.dirty) {
			state.dirty = false
			render(view)
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
				}
			}
			state.dirty = true
		}
		requestAnimationFrame(update)
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
		let map = app.map
		// undo scaling
		let realpos = {
			x: (pos.x - window.innerWidth / 2) / view.scale,
			y: (pos.y - window.innerHeight / 2) / view.scale,
		}
		// relative to top left corner of map
		let gridpos = {
			x: realpos.x + map.width * tilesize / 2 - camera.x,
			y: realpos.y + map.height * tilesize / 2 - camera.y,
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
		x: Math.round(view.width / 2 - cache.map.width / 2 + camera.x),
		y: Math.round(view.height / 2 - cache.map.width / 2 + camera.y)
	}

	context.drawImage(cache.map, origin.x, origin.y)

	if (cache.range) {
		let range = cache.range
		context.globalAlpha = 0.125
		for (let square of range.squares) {
			let x = origin.x + square.cell.x * tilesize
			let y = origin.y + square.cell.y * tilesize
			if (square.type === "move") {
				context.fillStyle = "blue"
			} else if (square.type === "attack") {
				context.fillStyle = "red"
			}
			context.fillRect(x, y, tilesize - 1, tilesize - 1)
		}
		context.globalAlpha = 1
	}

	let app = view.app
	for (let unit of app.map.units) {
		let sprite = sprites.pieces[unit.faction][unit.type]
		let x = origin.x + unit.cell.x * tilesize
		let y = origin.y + unit.cell.y * tilesize
		let z = 0
		if (cache.selection && cache.selection.unit === unit) {
			z = Math.round(cache.selection.anim.y)
		}
		if (selection && unit === selection.unit) {
			context.drawImage(sprites.select[selection.unit.faction], x - 2, y - 2)
		}
		context.drawImage(sprite, x, y - 1 - z)
	}

	if (cache.preview) {
		let preview = cache.preview
		const margin = 4
		let x = Math.round(lerp(-preview.image.width, margin, preview.anim.x))
		let y = view.height - preview.image.height + 1 - margin
		context.drawImage(preview.image, x, y)
	}
}
