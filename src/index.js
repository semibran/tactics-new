import loadImage from "img-load"
import disasm from "./view/disasm"
import * as View from "./view"
import * as Map from "./game/map"
import * as Game from "./game"
import map from "./maps/test"

let state = Game.create(map)
loadImage("sprites.png").then(main)

function main(sprites) {
	let view = View.create(160, 160, disasm(sprites))
	document.body.appendChild(view.element)
	View.init(view, state)
}
