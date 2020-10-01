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
				position: { x: 0, y: 0 },
				pressed: null,
			}
		}
	}
}

export function init(view) {
	let { camera, pointer } = view.state
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
			pointer.position = getPosition(event)
			if (pointer.position) {
				pointer.pressed = {
					x: pointer.position.x - camera.x * view.scale,
					y: pointer.position.y - camera.y * view.scale
				}
			}
		},
		move(event) {
			pointer.position = getPosition(event)
			if (pointer.position && pointer.pressed) {
				camera.x = (pointer.position.x - pointer.pressed.x) / view.scale
				camera.y = (pointer.position.y - pointer.pressed.y) / view.scale
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
				let x = Math.round(j * 16 + center.x)
				let y = Math.round(i * 16 + center.y)
				context.fillRect(x, y, 16, 16)
			}
		}
	}

	context.drawImage(sprites.pieces.player.soldier, center.x +  0, center.y -  1)
	context.drawImage(sprites.pieces.player.fighter, center.x + 16, center.y -  1)
	context.drawImage(sprites.pieces.player.knight,  center.x + 32, center.y -  1)
	context.drawImage(sprites.pieces.player.thief,   center.x + 48, center.y -  1)
	context.drawImage(sprites.pieces.player.mage,    center.x + 64, center.y -  1)
	context.drawImage(sprites.pieces.player.archer,  center.x + 80, center.y -  1)
	context.drawImage(sprites.pieces.enemy.soldier,  center.x +  0, center.y + 15)
	context.drawImage(sprites.pieces.enemy.fighter,  center.x + 16, center.y + 15)
	context.drawImage(sprites.pieces.enemy.knight,   center.x + 32, center.y + 15)
	context.drawImage(sprites.pieces.enemy.thief,    center.x + 48, center.y + 15)
	context.drawImage(sprites.pieces.enemy.mage,     center.x + 64, center.y + 15)
	context.drawImage(sprites.pieces.enemy.archer,   center.x + 80, center.y + 15)
}
