import rgb from "../../lib/rgb"

export default function renderMap(map, sprites) {
	let palette = sprites.palette
	let canvas = document.createElement("canvas")
	let context = canvas.getContext("2d")
	canvas.width = map.width * map.tilesize
	canvas.height = map.height * map.tilesize
	context.fillStyle = rgb(...palette.coal)
	context.fillRect(0, 0, canvas.width, canvas.height)
	context.fillStyle = rgb(...palette.jet)
	for (let i = 0; i < map.height; i++) {
		for (let j = 0; j < map.width; j++) {
			if ((j + i) % 2) {
				let x = j * map.tilesize
				let y = i * map.tilesize
				context.fillRect(x, y, map.tilesize, map.tilesize)
			}
		}
	}
	return canvas
}
