let canvas = document.createElement("canvas")
canvas.width = 320
canvas.height = 568
document.body.appendChild(canvas)

let context = canvas.getContext("2d")
context.fillRect(0, 0, canvas.width, canvas.height)

let state = {}
let actions = {}

function main() {
	let view = View.create(320, 568)
	document.appendChild(view.element)
	requestAnimationFrame(loop)

	function loop() {
		View.render(view)
		requestAnimationFrame(loop)
	}
}
