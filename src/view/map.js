export default function renderMap(map, tilesize) {
	let canvas = document.createElement("canvas")
	let context = canvas.getContext("2d")
	canvas.width = map.width * tilesize
	canvas.height = map.height * tilesize
	context.fillRect(0, 0, canvas.width, canvas.height)
	context.fillStyle = "#112"
	for (let i = 0; i < map.height; i++) {
		for (let j = 0; j < map.width; j++) {
			if ((j + i) % 2) {
				let x = j * tilesize
				let y = i * tilesize
				context.fillRect(x, y, tilesize, tilesize)
			}
		}
	}
	return canvas
}
