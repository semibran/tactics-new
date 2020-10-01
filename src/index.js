import loadImage from "img-load"
import disasm from "./sprites"
import * as View from "./view"
import map from "./maps/test"

let state = (data => {
	let map = { units: [] }
	for (let unit of data.units) {
		map.units.push({
			type: unit.type,
			name: unit.name,
			faction: unit.faction,
			x: unit.position[0],
			y: unit.position[1]
		})
	}

	return { map }
})(map)

loadImage("sprites.png").then(main)

function main(sprites) {
	let view = View.create(160, 160, disasm(sprites))
	document.body.appendChild(view.element)
	View.init(view, state)
}
