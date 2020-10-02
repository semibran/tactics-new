import * as Map from "./game/map"
import * as Cell from "../lib/cell"
import * as iconnames from "./view/icons"
import renderText from "./view/text"
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
			selection: {
				unit: null
			},
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
	let { camera, pointer, selection } = view.state

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
	let actions = {
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
				if (selection.unit) {
					selection.unit = null
					render(view)
				} else if (unit) {
					selection.unit = unit
					console.log(unit)
					render(view)
				}
			}
			pointer.pressed = null
		}
	}

	actions.resize()
	window.addEventListener("resize", actions.resize)
	window.addEventListener("mousedown", actions.press)
	window.addEventListener("mousemove", actions.move)
	window.addEventListener("mouseup", actions.release)
	window.addEventListener("touchstart", actions.press)
	window.addEventListener("touchmove", actions.move)
	window.addEventListener("touchend", actions.release)

	function switchDevice(event) {
		let device = "desktop"
		if (event.touches) {
			device = "mobile"
			window.removeEventListener("mousedown", actions.press)
			window.removeEventListener("mousemove", actions.move)
			window.removeEventListener("mouseup", actions.release)
		} else {
			window.removeEventListener("touchstart", actions.press)
			window.removeEventListener("touchmove", actions.move)
			window.removeEventListener("touchend", actions.release)
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

export function render(view) {
	let sprites = view.sprites
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
		if (unit === selection.unit) {
			context.drawImage(sprites.select[selection.unit.faction], x - 2, y - 2)
		}
		context.drawImage(sprite, x, y - 1)
	}

	let content = selection.unit
		? selection.unit.name
		: "(Select a unit!)"
	let text = renderText(content, sprites.fonts.standardBold)
	let y = view.height - text.height - 2
	if (selection.unit) {
		let iconname = iconnames.units[selection.unit.type]
		let icon = sprites.icons[iconname]
		let badge = sprites.badges[selection.unit.faction]
		context.drawImage(icon, 4, y + 1)
		context.drawImage(badge, 4 + icon.width - 1, y)
		context.drawImage(text, 14, y)
	} else {
		context.drawImage(text, 4, y)
	}
}
