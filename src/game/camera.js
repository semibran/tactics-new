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

export function centerCamera(screen, cell) {
	let camera = screen.camera
	let map = screen.map
	camera.target.x = map.image.width / 2 - (cell.x + 0.5) * tilesize
	camera.target.y = map.image.height / 2 - (cell.y + 0.5) * tilesize
}
