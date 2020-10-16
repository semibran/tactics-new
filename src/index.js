import loadImage from "img-load"
import disasm from "./disasm"
import * as View from "./view"
import * as Game from "./game/game"
import map from "./maps/v2"

let state = Game.create(map)
loadImage("sprites.png").then(main)

function main(sprites) {
	let view = View.create(160, 160, disasm(sprites))
	document.body.appendChild(view.element)
	View.init(view, state)
}
