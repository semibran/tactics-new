import * as View from "./view"

let state = {}
main()

function main() {
	let view = View.create(160, 160)
	document.body.appendChild(view.element)
	View.init(view)
	View.render(view)

	// requestAnimationFrame(loop)

	function loop() {
		View.init(view)
		requestAnimationFrame(loop)
	}
}
