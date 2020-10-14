import * as Anims from "../anims"
import * as Camera from "./camera"
import * as Comps from "./comps"
import * as Modes from "./modes"
import renderMap from "../view/render-map"
import getOrigin from "../helpers/get-origin"

export const layerseq = [ "map", "range", "shadows", "ring", "pieces", "selection", "ui" ]
export const tilesize = 16

export function create(data) {
	return {
		id: "Game",
		mode: Modes.Home.create(),
		nextMode: null,
		anims: [],
		comps: [],
		view: null,
		time: 0,
		dirty: false,
		camera: Camera.create(),
		map: {
			width: data.map.width,
			height: data.map.height,
			tilesize: tilesize,
			data: data.map,
			image: null
		},
		cache: {
			mode: null,
			camera: { x: 0, y: 0 },
			panoffset: null,
		}
	}
}

export function onenter(screen, view) {
	let sprites = view.sprites
	screen.view = view
	screen.map.image = renderMap(screen.map.data, tilesize, sprites.palette)
}

export function onresize(screen, viewport) {
	screen.camera.width = viewport.width
	screen.camera.height = viewport.height
	screen.camera.zoom = viewport.scale
}

export function onpress(screen, pointer) {
	Camera.startPan(screen.camera)
	// call mode onpress hook
	let onpress = Modes[screen.mode.id].onpress
	if (onpress) {
		onpress(screen.mode, screen, pointer)
	}
}

export function onmove(screen, pointer) {
	// call mode onmove hook
	let onmove = Modes[screen.mode.id].onmove
	if (onmove) {
		onmove(screen.mode, screen, pointer)
	}
}

export function onrelease(screen, pointer) {
	// call mode onrelease hook
	let onrelease = Modes[screen.mode.id].onrelease
	if (onrelease) {
		onrelease(screen.mode, screen, pointer)
	}
}

export function onupdate(screen) {
	screen.time++
	updateCamera(screen)
	updateAnims(screen)
	updateComps(screen)

	// begin transition if mode has mode change queued
	let next = screen.mode.next
	if (next && !screen.nextMode) {
		switchMode(screen, next.id, next.data)
	}

	// call mode onupdate hook
	let onupdate = Modes[screen.mode.id].onupdate
	if (onupdate) {
		onupdate(screen.mode, screen)
	}
}

export function updateCamera(screen) {
	let camera = screen.camera
	let cache = screen.cache
	if (Math.round(cache.camera.x) !== Math.round(camera.pos.x)
	|| Math.round(cache.camera.y) !== Math.round(camera.pos.y)) {
		cache.camera.x = camera.pos.x
		cache.camera.y = camera.pos.y
		screen.dirty = true
	}

	Camera.update(screen.camera)
}

export function updateAnims(screen) {
	for (let i = 0; i < screen.anims.length; i++) {
		let anim = screen.anims[i]
		if (anim.done) {
			screen.anims.splice(i--, 1)
		} else {
			Anims[anim.id].update(anim)
		}
		screen.dirty = true
	}
}

export function updateComps(screen) {
	for (let c = 0; c < screen.comps.length; c++) {
		let comp = screen.comps[c]
		for (let a = 0; a < comp.anims.length; a++) {
			let anim = comp.anims[a]
			if (anim.done) {
				comp.anims.splice(a--, 1)
			} else {
				Anims[anim.id].update(anim)
			}
			screen.dirty = true
		}
		if (comp.exit && !comp.anims.length) {
			screen.comps.splice(c--, 1)
		}
	}
}

function switchMode(screen, next, data) {
	if (!Modes[next]) {
		throw new Error(`Attempting to switch to nonexistent mode ${next}`)
	}

	// call old mode onexit hook
	let onexit = Modes[screen.mode.id].onexit
	if (onexit) {
		onexit(screen.mode, screen)
	}

	// set current mode as old mode
	screen.cache.mode = screen.mode

	// replace current mode with new node
	screen.mode = Modes[next].create(data)
	screen.mode.time = screen.time
	if (Modes[next].onenter) {
		Modes[next].onenter(screen.mode, screen)
	}

	// queue up redraw
	screen.dirty = true
}

export function render(screen) {
	let { map, mode, cache, camera } = screen
	let game = screen.data
	let sprites = screen.view.sprites
	let nodes = []

	camera.origin = getOrigin(map, screen.camera)

	// queue map
	nodes.push({
		image: map.image,
		layer: "map",
		x: camera.origin.x,
		y: camera.origin.y
	})

	for (let comp of screen.comps) {
		let compnodes = Comps[comp.id].render(comp, screen)
		nodes.push(...compnodes)
	}

	// queue cursor

	// queue units
	for (let unit of map.data.units) {
		let sprite = sprites.pieces[unit.faction][unit.type]
		let cell = unit.cell
		let x = camera.origin.x + cell.x * map.tilesize
		let y = camera.origin.y + cell.y * map.tilesize
		let z = 0
		let piecelayer = "pieces"
		if (mode.id === "Select" && mode.unit === unit
		|| cache.mode && cache.mode.id === "Select" && cache.mode.unit === unit) {
			let anim = screen.anims.find(anim =>
				[ "PieceLift", "PieceDrop" ].includes(anim.id))
			if (anim) {
				z = anim.y
				nodes.push({
					image: sprites.select.ring[unit.faction],
					layer: "ring",
					x: x - 2,
					y: y - 2
				})
				piecelayer = "selection"
			}
		}
		nodes.push({
			image: sprite,
			layer: piecelayer,
			x: x + 1,
			y: y - 1,
			z: z
		})
		nodes.push({
			image: sprites.pieces.shadow,
			layer: "shadows",
			x: x + 1,
			y: y + 3
		})
	}

	return nodes
}
