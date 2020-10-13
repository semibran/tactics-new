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
import getPosition from "../helpers/get-position"
import getCell from "../helpers/get-cell"
import getQuadrance from "../helpers/get-quadrance"

export function create(width, height, sprites) {
	return {
		native: { width, height },
		sprites: sprites,
		element: document.createElement("canvas"),
		screen: null,
		time: 0,
		cache: { nodes: [] },
		viewport: {
			width: window.innerWidth,
			height: window.innerHeight,
			scale: 1
		},
		pointer: {
			pos: null,
			presspos: null,
			mode: null,
			time: 0
		}
	}
}

export function init(view, game) {
	let { viewport, sprites, pointer } = view

	let Screen = screens.Game
	let screen = Screen.create(game, sprites)
	let map = screen.map
	view.screen = screen

	let device = null
	let events = {
		resize() {
			// update cache to match window size
			let scaleX = Math.max(1, Math.floor(window.innerWidth / view.native.width))
			let scaleY = Math.max(1, Math.floor(window.innerHeight / view.native.height))
			viewport.scale = Math.min(scaleX, scaleY)
			viewport.width = Math.ceil(window.innerWidth / viewport.scale)
			viewport.height = Math.ceil(window.innerHeight / viewport.scale)

			// resize canvas
			let canvas = view.element
			canvas.width = viewport.width
			canvas.height = viewport.height
			canvas.style.transform = `scale(${ viewport.scale })`

			// call resize hook
			if (Screen.onresize) {
				Screen.onresize(screen, viewport)
			}
			view.dirty = true
		},
		press(event) {
			if (!device) device = switchDevice(event)
			if (pointer.presspos) return false

			// attempt to detect pointer position
			// if we fail, ignore the event
			pointer.pos = getPosition(event)
			if (!pointer.pos) return false

			// click is within bounds, we can use it
			pointer.time = view.time
			pointer.mode = "click"
			pointer.presspos = pointer.pos

			// call press hook
			if (Screen.onpress) {
				Screen.onpress(screen, pointer)
				if (screen.dirty) view.dirty = true
			}
		},
		move(event) {
			pointer.pos = getPosition(event)
			if (!pointer.pos || !pointer.presspos) return false
			if (pointer.mode === "click") {
				let cursor = pointer.pos
				let origin = pointer.presspos
				const maxdist = 3
				if (getQuadrance(origin, cursor) > Math.pow(maxdist, 2)) {
					pointer.mode = "drag"
				}
			}
			// call move hook
			if (Screen.onmove) {
				Screen.onmove(screen, pointer)
				if (screen.dirty) view.dirty = true
			}
		},
		release(event) {
			if (!pointer.presspos) return false
			// call release hook
			if (Screen.onrelease) {
				Screen.onrelease(screen, pointer)
				if (screen.dirty) view.dirty = true
			}
			// reset after hook in case the data is used
			pointer.mode = null
			pointer.presspos = null
		}
	}

	function update() {
		view.time++
		if (view.dirty) {
			view.dirty = false
			render(view)
		}
		requestAnimationFrame(update)

		// update hook
		if (Screen.onupdate) {
			Screen.onupdate(screen)
			if (screen.dirty) view.dirty = true
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
}

export function render(view) {
	// clear canvas
	let canvas = view.element
	let context = canvas.getContext("2d")
	context.fillStyle = "black"
	context.fillRect(0, 0, canvas.width, canvas.height)

	// clear screen
	let nodes = view.cache.nodes
	nodes.length = 0

	// queue nodes
	let screen = view.screen
	let Screen = screens[screen.id]
	let screennodes = Screen.render(screen, view)
	nodes.push(...screennodes)

	// draw on canvas
	drawNodes(nodes, Screen.layerseq, context)
}
