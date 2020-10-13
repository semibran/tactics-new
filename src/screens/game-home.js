export function create() {
	return {
		id: "Home",
		pointer: {
			unit: null,     // unit
			panoffset: null // { x, y }
		}
	}
}

export function onpress(mode, screen) {
	mode.pointer.panoffset = {
		x: screen.camera.pos.x * screen.camera.zoom,
		y: screen.camera.pos.y * screen.camera.zoom
	}
}

export function onmove(mode, screen, pointer) {
	panCamera(mode, screen, pointer)
}

export function panCamera(mode, screen, pointer) {
	let camera = screen.camera
	let delta = {
		x: pointer.pos.x - pointer.presspos.x,
		y: pointer.pos.y - pointer.presspos.y
	}

	camera.target.x = (delta.x + mode.pointer.panoffset.x) / camera.zoom
	camera.target.y = (delta.y + mode.pointer.panoffset.y) / camera.zoom

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
