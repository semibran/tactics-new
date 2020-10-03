import findRange from "./game/range"
import * as Map from "./game/map"
import * as Cell from "../lib/cell"
import renderMap from "./view/map"
import renderUnitPreview from "./view/unit-preview"
import { easeOut } from "../lib/exponential"
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
		app: null
	}
}

export function init(view, app) {
	let state = view.state
	let cache = view.cache
	let { camera, pointer } = state

	view.app = app
	view.cache.map = renderMap(app.map, tilesize)

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
			let cursor = snapToGrid(pointer.pos)
			if (pointer.clicking) {
				let origin = snapToGrid(pointer.pressed)
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
				if (view.state.selection) {
					deselect(view)
				} else if (unit) {
					select(view, unit)
				}
			}
			pointer.pressed = null
		}
	}

	function loop() {
		state.time++
		if (state.selection) {
			let elapsed = state.time - state.selection.time
			let t = elapsed / 10
			if (t <= 1) {
				state.dirty = true
			}
		} else if (cache.selection) {
			let elapsed = state.time - cache.selection.time
			let t = elapsed / 5
			if (t <= 1) {
				state.dirty = true
			} else {
				cache.selection = null
			}
		}
		if (state.dirty) {
			state.dirty = false
			render(view)
		}
		requestAnimationFrame(loop)
	}

	events.resize()
	window.addEventListener("resize", events.resize)
	window.addEventListener("mousedown", events.press)
	window.addEventListener("mousemove", events.move)
	window.addEventListener("mouseup", events.release)
	window.addEventListener("touchstart", events.press)
	window.addEventListener("touchmove", events.move)
	window.addEventListener("touchend", events.release)
	requestAnimationFrame(loop)

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

function select(view, unit) {
	view.state.selection = {
		unit: unit,
		time: view.state.time
	}
	view.cache.selection = {
		time: 0,
		range: findRange(unit, view.app.map),
		preview: renderUnitPreview(unit, view.sprites)
	}
	view.state.dirty = true
}

function deselect(view) {
	view.cache.selection.time = view.state.time
	view.state.selection = null
	view.state.dirty = true
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

	if (selection) {
		let range = cache.selection.range
		context.globalAlpha = 0.125
		context.fillStyle = "blue"
		for (let cell of range.move) {
			let x = origin.x + cell.x * tilesize
			let y = origin.y + cell.y * tilesize
			context.fillRect(x, y, tilesize - 1, tilesize - 1)
		}
		context.fillStyle = "red"
		for (let cell of range.attack) {
			let x = origin.x + cell.x * tilesize
			let y = origin.y + cell.y * tilesize
			context.fillRect(x, y, tilesize - 1, tilesize - 1)
		}
		context.globalAlpha = 1
	}

	let app = view.app
	for (let unit of app.map.units) {
		let sprite = sprites.pieces[unit.faction][unit.type]
		let x = origin.x + unit.cell.x * tilesize
		let y = origin.y + unit.cell.y * tilesize
		if (selection && unit === selection.unit) {
			context.drawImage(sprites.select[selection.unit.faction], x - 2, y - 2)
		}
		context.drawImage(sprite, x, y - 1)
	}

	if (selection) {
		let preview = cache.selection.preview
		let a = -preview.width
		let b = 4
		let d = 10
		let e = Math.min(d, state.time - state.selection.time)
		let t = easeOut(e / d)
		let x = Math.round(a + (b - a) * t)
		context.drawImage(preview, x, view.height - preview.height - 4)
	} else if (cache.selection) {
		let preview = cache.selection.preview
		let a = 4
		let b = -preview.width
		let d = 5
		let e = Math.min(d, state.time - cache.selection.time)
		let t = e / d
		let x = Math.round(a + (b - a) * t)
		context.drawImage(preview, x, view.height - preview.height - 4)
	}
}
