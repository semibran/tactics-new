import loadImage from "img-load"
import disasm from "./view/sprites"
import * as View from "./view"
import map from "./maps/test"
import * as Map from "./game/map"

let state = { map: Map.create(map) }

loadImage("sprites.png").then(main)

function main(sprites) {
	let view = View.create(160, 160, disasm(sprites))
	document.body.appendChild(view.element)
	View.init(view, state)
}
