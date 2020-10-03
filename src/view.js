import * as Map from "./game/map"
import * as Cell from "../lib/cell"
import renderUnitPreview from "./view/unit-preview"
const tilesize = 16

export function create(width, height, sprites) {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
		native: { width, height },
		scale: 1,
		sprites: sprites,
		element: document.createElement("canvas"),
		state: {
			camera: { x: 0, y: 0 },
			selection: null,
			pointer: {
				pos: null,
				clicking: false,
				pressed: null,
				offset: null
			}
		},
		app: null
	}
}

export function init(view, app) {
	let { camera, pointer } = view.state

	view.app = app
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
			render(view)
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
			let cursor = snapToGrid(pointer.pos)
			if (!pointer.pos || !pointer.pressed) return
			if (pointer.clicking) {
				let origin = snapToGrid(pointer.pressed)
				if (!Cell.equals(origin, cursor)) {
					pointer.clicking = false
				}
			}
			camera.x = (pointer.pos.x - pointer.pressed.x + pointer.offset.x) / view.scale
			camera.y = (pointer.pos.y - pointer.pressed.y + pointer.offset.y) / view.scale
			render(view)
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

	events.resize()
	window.addEventListener("resize", events.resize)
	window.addEventListener("mousedown", events.press)
	window.addEventListener("mousemove", events.move)
	window.addEventListener("mouseup", events.release)
	window.addEventListener("touchstart", events.press)
	window.addEventListener("touchmove", events.move)
	window.addEventListener("touchend", events.release)

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
		preview: renderUnitPreview(unit, view.sprites)
	}
	render(view)
}

function deselect(view) {
	view.state.selection = null
	render(view)
}

export function render(view) {
	let sprites = view.sprites
	let palette = sprites.palette
	let canvas = view.element
	let context = canvas.getContext("2d")
	context.fillStyle = "black"
	context.fillRect(0, 0, canvas.width, canvas.height)

	let { camera, selection } = view.state
	let center = {
		x: Math.round(view.width / 2 - 64 + camera.x),
		y: Math.round(view.height / 2 - 64 + camera.y)
	}

	context.fillStyle = "#112"
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if ((j + i) % 2) {
				let x = j * 16 + center.x
				let y = i * 16 + center.y
				context.fillRect(x, y, 16, 16)
			}
		}
	}

	let app = view.app
	for (let unit of app.map.units) {
		let sprite = sprites.pieces[unit.faction][unit.type]
		let x = center.x + unit.x * 16
		let y = center.y + unit.y * 16
		if (selection && unit === selection.unit) {
			context.drawImage(sprites.select[selection.unit.faction], x - 2, y - 2)
		}
		context.drawImage(sprite, x, y - 1)
	}

	if (selection) {
		let preview = selection.preview
		context.drawImage(preview, 4, view.height - preview.height - 4)
	}
}
