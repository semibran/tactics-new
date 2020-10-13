import * as Home from "./game-home"
import * as Select from "./game-select"
import * as Forecast from "./game-forecast"
import * as Map from "../game/map"
import renderMap from "../view/render-map"
import getOrigin from "../helpers/get-origin"
import getCell from "../helpers/get-cell"

export const tilesize = 16
export const layerseq = [ "map", "shadows", "pieces", "ui" ]
const modes = { Home, Select, Forecast }

export function create(data, sprites) {
	let mode = Home.create()
	let map = {
		width: data.map.width,
		height: data.map.height,
		tilesize: tilesize,
		data: data.map,
		image: renderMap(data.map, tilesize, sprites.palette)
	}
	return {
		id: "Game",
		data: data,
		anims: [],
		map: map,
		mode: mode,
		dirty: false,
		camera: {
			width: 0,
			height: 0,
			zoom: 0,
			pos: { x: 0, y: 0 },
			vel: { x: 0, y: 0 },
			target: { x: 0, y: 0 }
		},
		cache: {
			camera: { x: 0, y: 0 }
		}
	}
}

export function onresize(screen, viewport) {
	screen.camera.width = viewport.width
	screen.camera.height = viewport.height
	screen.camera.zoom = viewport.scale
}

export function onpress(screen, pointer) {
	let cell = getCell(pointer.pos, screen.map, screen.camera)
	let unit = Map.unitAt(screen.map.data, cell)
	console.log(unit)

	// call mode press hook
	let mode = screen.mode
	if (modes[mode.id].onpress) {
		modes[mode.id].onpress(mode, screen)
	}
}

export function onmove(screen, pointer) {
	// call mode move hook
	let mode = screen.mode
	if (modes[mode.id].onmove) {
		modes[mode.id].onmove(mode, screen, pointer)
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
	if (modes[mode.id].onupdate) {
		modes[mode.id].onupdate(mode, screen)
	}
}

export function render(screen, view) {
	let game = screen.data
	let map = screen.map
	let sprites = view.sprites
	let nodes = []
	let origin = getOrigin(map, screen.camera)

	// queue map
	nodes.push({
		image: map.image,
		layer: "map",
		x: origin.x,
		y: origin.y
	})

	// queue units
	for (let unit of game.map.units) {
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

	/*
	// // queue range
	// if (cache.range) {
	// 	for (let square of cache.range.squares) {
	// 		let sprite = sprites.squares[square.type]
	// 		let x = origin.x + square.cell.x * tilesize
	// 		let y = origin.y + square.cell.y * tilesize
	// 		layers.range.push({ image: sprite, x, y })
	// 	}
	// }
	// // queue cursor
	// if (select && select.cursor
	// && (!select.anim || select.anim && select.anim.type !== "PieceMove")
	// && select.valid
	// && !Cell.equals(select.cursor.target, select.unit.cell)
	// && Map.contains(game.map, select.cursor.target)
	// ) {
	// 	let sprite = sprites.select.cursor[game.phase.faction]
	// 	let x = origin.x + select.cursor.pos.x - 1
	// 	let y = origin.y + select.cursor.pos.y - 1
	// 	layers.selection.push({ image: sprite, x, y })
	// }*/
}
