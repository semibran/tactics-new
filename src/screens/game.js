import * as Home from "./game-home"
import * as Select from "./game-select"
import * as Forecast from "./game-forecast"
import * as Range from "./game-range"
import renderMap from "../view/render-map"
import getOrigin from "../helpers/get-origin"

export const Comps = { Range }
export const Modes = { Home, Select, Forecast }
export const layerseq = [ "map", "range", "shadows", "pieces", "ui" ]
export const tilesize = 16

export function create(data) {
	return {
		id: "Game",
		mode: Home.create(),
		view: null,
		anims: [],
		comps: [],
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
			target: { x: 0, y: 0 }
		},
		cache: {
			mode: null,
			camera: { x: 0, y: 0 },
			panoffset: null,
		}
	}
}

export function enter(screen, view) {
	let sprites = view.sprites
	screen.view = view
	screen.map.image = renderMap(screen.map.data, tilesize, sprites.palette)
}

export function switchMode(screen, next, data) {
	// call mode exit hook
	let onexit = Modes[screen.mode.id].exit
	if (onexit) {
		onexit(screen.mode, screen)
	}
	screen.cache.mode = screen.mode
	screen.mode = next.create(data)
	next.enter(screen.mode, screen)
	screen.dirty = true
}

export function addComp(screen, data) {
	screen.cache.range = {
		data: data,
		image: renderRange(data, screen.view.sprites)
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
	// call mode press hook
	let mode = screen.mode
	if (Modes[mode.id].onpress) {
		Modes[mode.id].onpress(mode, screen)
	}
}

export function onmove(screen, pointer) {
	// call mode move hook
	let mode = screen.mode
	if (Modes[mode.id].onmove) {
		Modes[mode.id].onmove(mode, screen, pointer)
	}
}

export function onrelease(screen, pointer) {
	// call mode release hook
	let mode = screen.mode
	if (Modes[mode.id].onrelease) {
		Modes[mode.id].onrelease(mode, screen, pointer)
	}
}

export function onupdate(screen) {
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

	// call mode hooks (for home press and hold)
	let mode = screen.mode
	if (Modes[mode.id].onupdate) {
		Modes[mode.id].onupdate(mode, screen)
	}
}

export function render(screen) {
	let game = screen.data
	let map = screen.map
	let cache = screen.cache
	let sprites = screen.view.sprites
	let nodes = []
	let origin = getOrigin(map, screen.camera)

	// queue map
	nodes.push({
		image: map.image,
		layer: "map",
		x: origin.x,
		y: origin.y
	})

	for (let comp of screen.comps) {
		let compnodes = Comps[comp.id].render(comp, origin)
		nodes.push(...compnodes)
	}

	// queue cursor

	// queue units
	for (let unit of map.data.units) {
		let sprite = sprites.pieces[unit.faction][unit.type]
		let cell = unit.cell
		let x = origin.x + cell.x * map.tilesize
		let y = origin.y + cell.y * map.tilesize
		let z = 0
		/*
		// if (game.phase.faction === unit.faction) {
		// 	if (game.phase.pending.includes(unit)) {
		// 		if (!select || select.unit !== unit) {
		// 			let glow = sprites.select.glow[unit.faction]
		// 			nodes.push({
		// 				image: glow,
		// 				layer: "pieces",
		// 				x: x,
		// 				y: y - 2
		// 			})
		// 		}
		// 	} else {
		// 		sprite = sprites.pieces.done[unit.faction][unit.type]
		// 	}
		// }
		// if (select && select.unit === unit) {
		// 	let anim = select.anim
		// 	if (anim) {
		// 		if (anim.type !== "PieceMove" || state.time % 2) {
		// 			let ring = sprites.select.ring[unit.faction]
		// 			layers.markers.push({ image: ring, x: x - 2, y: y - 2, z: 0 })
		// 		}
		// 		if (anim.type === "PieceMove") {
		// 			x = origin.x + anim.cell.x * tilesize
		// 			y = origin.y + anim.cell.y * tilesize
		// 		} else {
		// 			z = Math.round(select.anim.y)
		// 		}
		// 	} else if (select.dest) {
		// 		x = origin.x + select.dest.x * tilesize
		// 		y = origin.y + select.dest.y * tilesize
		// 	}
		// 	piecelayer = "selection"
		// } else {
		// 	piecelayer = "pieces"
		// }
		*/
		nodes.push({
			image: sprite,
			layer: "pieces",
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
