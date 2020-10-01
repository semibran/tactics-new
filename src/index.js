import loadImage from "img-load"
import disasm from "./sprites"
import * as View from "./view"

let state = {}
loadImage("sprites.png").then(main)

function main(sprites) {
	let view = View.create(160, 160, disasm(sprites))
	document.body.appendChild(view.element)
	View.init(view)
	// requestAnimationFrame(loop)

	function loop() {
		View.init(view)
		requestAnimationFrame(loop)
	}
}
