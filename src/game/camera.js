export function create() {
	return {
		width: 0,
		height: 0,
		zoom: 0,
		pos: { x: 0, y: 0 },
		vel: { x: 0, y: 0 },
		target: { x: 0, y: 0 },
		origin: { x: 0, y: 0 },
		offset: { x: 0, y: 0 }
	}
}

export function update(camera) {
	// update camera position
	camera.pos.x += camera.vel.x
	camera.pos.y += camera.vel.y
	camera.vel.x += ((camera.target.x - camera.pos.x) / 8 - camera.vel.x) / 2
	camera.vel.y += ((camera.target.y - camera.pos.y) / 8 - camera.vel.y) / 2
}

export function reset(camera) {
	// hard reset camera position
	camera.pos.x = camera.target.x
	camera.pos.y = camera.target.y
}

export function startPan(camera) {
	camera.offset = {
		x: camera.pos.x * camera.zoom,
		y: camera.pos.y * camera.zoom
	}
}

export function pan(camera, map, pointer) {
	let delta = {
		x: pointer.pos.x - pointer.presspos.x,
		y: pointer.pos.y - pointer.presspos.y
	}

	camera.target.x = (delta.x + camera.offset.x) / camera.zoom
	camera.target.y = (delta.y + camera.offset.y) / camera.zoom

	let left = map.image.width / 2
	let right = -map.image.width / 2
	let top = map.image.height / 2
	let bottom = -map.image.height / 2
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

export function center(camera, map, cell) {
	camera.target.x = map.image.width / 2 - (cell.x + 0.5) * map.tilesize
	camera.target.y = map.image.height / 2 - (cell.y + 0.5) * map.tilesize
}

// getOrigin(map, camera) -> pos
// > finds the top left corner of the map
// > relative to the given camera
export function getOrigin(camera, map) {
	return {
		x: camera.width / 2 - map.width * map.tilesize / 2 + camera.pos.x,
		y: camera.height / 2 - map.height * map.tilesize / 2 + camera.pos.y
	}
}
