import * as Map from "../game/map"
import rgb from "../../lib/rgb"

export default function renderMap(map, sprites) {
	let palette = sprites.palette
	let canvas = document.createElement("canvas")
	let context = canvas.getContext("2d")
	canvas.width = map.width * map.tilesize
	canvas.height = map.height * map.tilesize
	context.fillRect(0, 0, canvas.width, canvas.height)
	for (let i = 0; i < map.height; i++) {
		for (let j = 0; j < map.width; j++) {
			if (!Map.at(map, { x: j, y: i }).walkable) continue
			let x = j * map.tilesize
			let y = i * map.tilesize
			let color = (j + i) % 2 ? palette.jet : palette.coal
			context.fillStyle = rgb(...color)
			context.fillRect(x, y, map.tilesize, map.tilesize)
		}
	}
	return canvas
}
