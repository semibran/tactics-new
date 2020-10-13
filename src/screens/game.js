import * as Home from "./game-home"
import * as Select from "./game-select"
import * as Forecast from "./game-forecast"
import renderMap from "../view/render-map"

export const tilesize = 16

export function init(data, sprites) {
	let mode = Home.init()
	let map = {
		width: data.map.width,
		height: data.map.height,
		tilesize: tilesize,
		image: renderMap(data.map, tilesize, sprites.palette)
	}
	return {
		id: "Game",
		data: data,
		anims: [],
		map: map
	}
}

export function move() {
	let cursor = snapToGrid(pointer.pos)
	pointer.unit = Map.unitAt(map, cursor)
	if (state.mode !== "select") return true
	pointer.offset = {
		x: camera.pos.x * view.scale,
		y: camera.pos.y * view.scale
	}
	if (!state.select) return
	let select = state.select
	let unit = select.unit
	// if unit hasn't moved, we can
	// start unit drag
	if (game.phase.pending.includes(unit)) {
		let selecting = actions.hover(cursor)
		if (selecting) {
			pointer.select = true
		}
	}
}

export function render(screen, view) {
	let game = screen.data
	let map = screen.map
	let sprites = view.sprites

	let nodes = []
	let origin = getOrigin(map, view.camera)

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

// getOrigin(map, camera) -> pos
// > finds the top left corner of the map
// > relative to the given camera
export default function getOrigin(map, camera) {
	return {
		x: camera.width / 2 - map.width * map.tilesize / 2 + camera.pos.x,
		y: camera.height / 2 - map.height * map.tilesize / 2 + camera.pos.y
	}
}
