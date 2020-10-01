export function create(width, height, sprites) {
	return {
		width: window.innerWidth,
		height: window.innerHeight,
		native: { width, height },
		scale: 1,
		sprites: sprites,
		element: document.createElement("canvas"),
		state: {}
	}
}

export function init(view) {
	function resize() {
		let scaleX = Math.max(1, Math.floor(window.innerWidth / view.native.width))
		let scaleY = Math.max(1, Math.floor(window.innerHeight / view.native.height))
		view.scale = Math.min(scaleX, scaleY)
		view.width = Math.ceil(window.innerWidth / view.scale)
		view.height = Math.ceil(window.innerHeight / view.scale)

		let canvas = view.element
		canvas.width = view.width
		canvas.height = view.height
		canvas.style.transform = `scale(${ view.scale })`

		console.log(view)
	}

	resize()
	window.addEventListener("resize", _ => {
		resize()
		render(view)
	})
}

export function render(view) {
	let canvas = view.element
	let context = canvas.getContext("2d")
	context.fillStyle = "white"
	context.fillRect(0, 0, canvas.width, canvas.height)

	let center = { x: view.width / 2 - 64, y: view.height / 2 - 64 }

	context.fillStyle = "gainsboro"
	for (let i = 0; i < 8; i++) {
		for (let j = 0; j < 8; j++) {
			if ((j + i) % 2) {
				let x = Math.round(j * 16 + center.x)
				let y = Math.round(i * 16 + center.y)
				context.fillRect(x, y, 16, 16)
			}
		}
	}
}
