const tilesize = 16

export function create(width, height, sprites) {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
		native: { width, height },
		scale: 1,
		sprites: sprites,
		element: document.createElement("canvas"),
		state: {
			camera: { x: 0, y: 0 },
			pointer: {
				pos: { x: 0, y: 0 },
				pressed: null,
			}
		},
		app: null
	}
}

export function init(view, app) {
	let { camera, pointer } = view.state
	view.app = app
	function onresize() {
		let scaleX = Math.max(1, Math.floor(window.innerWidth / view.native.width))
		let scaleY = Math.max(1, Math.floor(window.innerHeight / view.native.height))
		view.scale = Math.min(scaleX, scaleY)
		view.width = Math.ceil(window.innerWidth / view.scale)
		view.height = Math.ceil(window.innerHeight / view.scale)

		let canvas = view.element
		canvas.width = view.width
		canvas.height = view.height
		canvas.style.transform = `scale(${ view.scale })`
	}

	let actions = {
		resize() {
			onresize()
			render(view)
		},
		press(event) {
			document.body.classList.add("-dragging")
			pointer.pos = getPosition(event)
			if (pointer.pos) {
				pointer.pressed = {
					x: pointer.pos.x - camera.x * view.scale,
					y: pointer.pos.y - camera.y * view.scale
				}
				let map = app.map
				// undo scaling
				let realpos = {
					x: (pointer.pos.x - window.innerWidth / 2) / view.scale,
					y: (pointer.pos.y - window.innerHeight / 2) / view.scale,
				}
				// relative to top left corner of map
				let gridpos = {
					x: realpos.x + map.width * tilesize / 2 - camera.x,
					y: realpos.y + map.height * tilesize / 2 - camera.y,
				}
				// fix to tiles
				let cursor = {
					x: Math.floor(gridpos.x / tilesize),
					y: Math.floor(gridpos.y / tilesize)
				}
				let unit = map.units.find(unit => unit.x === cursor.x && unit.y === cursor.y)
				console.log(unit)
			}
		},
		move(event) {
			pointer.pos = getPosition(event)
			if (pointer.pos && pointer.pressed) {
				camera.x = (pointer.pos.x - pointer.pressed.x) / view.scale
				camera.y = (pointer.pos.y - pointer.pressed.y) / view.scale
				render(view)
			}
		},
		release() {
			document.body.classList.remove("-dragging")
			pointer.pressed = null
		}
	}

	function getPosition(event) {
		let x = event.pageX || event.touches && event.touches[0].pageX
		let y = event.pageY || event.touches && event.touches[0].pageY
		if (x === undefined || y === undefined) return null
		return { x, y }
	}

	actions.resize()
	window.addEventListener("resize", actions.resize)
	window.addEventListener("mousedown", actions.press)
	window.addEventListener("mousemove", actions.move)
	window.addEventListener("mouseup", actions.release)
	window.addEventListener("touchstart", actions.press)
	window.addEventListener("touchmove", actions.move)
	window.addEventListener("touchend", actions.release)
}

export function render(view) {
	let sprites = view.sprites
	let camera = view.state.camera
	let canvas = view.element
	let context = canvas.getContext("2d")
	context.fillStyle = "black"
	context.fillRect(0, 0, canvas.width, canvas.height)

	let center = {
		x: Math.round(view.width / 2 - 64 + camera.x),
		y: Math.round(view.height / 2 - 64 + camera.y)
	}

	context.fillStyle = "#112"
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if ((j + i) % 2) {
				let x = j * 16 + center.x
				let y = i * 16 + center.y
				context.fillRect(x, y, 16, 16)
			}
		}
	}

	let app = view.app
	for (let unit of app.map.units) {
		let sprite = sprites.pieces[unit.faction][unit.type]
		context.drawImage(sprite, center.x + unit.x * 16, center.y + unit.y * 16 - 1)
	}
}
