import * as Home from "./game-home"
import * as Select from "./game-select"
import * as Forecast from "./game-forecast"
import * as Range from "./game-range"
import * as Preview from "./game-preview"
import * as Anims from "../anims"
import renderMap from "../view/render-map"
import getOrigin from "../helpers/get-origin"

export const Comps = { Range, Preview }
export const Modes = { Home, Select, Forecast }
export const layerseq = [ "map", "range", "shadows", "ring", "pieces", "selection", "ui" ]
export const tilesize = 16

export function create(data) {
	return {
		id: "Game",
		mode: Home.create(),
		anims: [],
		comps: [],
		view: null,
		time: 0,
		dirty: false,
		map: {
			width: data.map.width,
			height: data.map.height,
			tilesize: tilesize,
			data: data.map,
			image: null
		},
		camera: {
			width: 0,
			height: 0,
			zoom: 0,
			pos: { x: 0, y: 0 },
			vel: { x: 0, y: 0 },
			target: { x: 0, y: 0 },
			origin: { x: 0, y: 0 }
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
	screen.cache.panoffset = {
		x: screen.camera.pos.x * screen.camera.zoom,
		y: screen.camera.pos.y * screen.camera.zoom
	}
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

	// call mode onupdate hook
	let onupdate = Modes[screen.mode.id].onupdate
	if (onupdate) {
		onupdate(screen.mode, screen)
	}
}

export function updateCamera(screen) {
	// rerender if camera is at least a pixel off from its drawn position
	let camera = screen.camera
	let cache = screen.cache
	if (Math.round(cache.camera.x) !== Math.round(camera.pos.x)
	|| Math.round(cache.camera.y) !== Math.round(camera.pos.y)) {
		cache.camera.x = camera.pos.x
		cache.camera.y = camera.pos.y
		screen.dirty = true
	}

	// update camera position
	camera.pos.x += camera.vel.x
	camera.pos.y += camera.vel.y
	camera.vel.x += ((camera.target.x - camera.pos.x) / 8 - camera.vel.x) / 2
	camera.vel.y += ((camera.target.y - camera.pos.y) / 8 - camera.vel.y) / 2
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

export function switchMode(screen, next, data) {
	// call old mode onexit hook
	let onexit = Modes[screen.mode.id].onexit
	if (onexit) {
		onexit(screen.mode, screen)
	}
	screen.dirty = true
	screen.cache.mode = screen.mode
	screen.mode = next.create(data)
	screen.mode.time = screen.time
	if (next.onenter) {
		next.onenter(screen.mode, screen)
	}
}

export function panCamera(screen, pointer) {
	let camera = screen.camera
	let delta = {
		x: pointer.pos.x - pointer.presspos.x,
		y: pointer.pos.y - pointer.presspos.y
	}

	camera.target.x = (delta.x + screen.cache.panoffset.x) / camera.zoom
	camera.target.y = (delta.y + screen.cache.panoffset.y) / camera.zoom

	let left = camera.width / 2
	let right = -camera.width / 2
	let top = camera.height / 2
	let bottom = -camera.height / 2
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
