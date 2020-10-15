import * as Anims from "../anims"
import * as Camera from "./camera"
import * as Comps from "./comps"
import * as Modes from "./modes"
import * as Unit from "./unit"
import * as Game from "./game"
import renderMap from "../view/render-map"
import getOrigin from "../helpers/get-origin"

export const tilesize = 16
export const layerseq = [
	"map",
	"range",
	"shadows",
	"arrow",
	"ring",
	"pieces",
	"cursor",
	"selection",
	"mirage",
	"ui"
]

export function create(data) {
	return {
		id: "Game",
		mode: Modes.Home.create(),
		nextMode: null,
		anims: [],
		comps: [],
		view: null,
		time: 0,
		dirty: false,
		camera: Camera.create(),
		map: Object.assign({ tilesize, image: null }, data.map),
		state: data,
		cache: {
			camera: { x: 0, y: 0 }
		}
	}
}

export function onenter(screen, view) {
	let sprites = view.sprites
	screen.view = view
	screen.map.image = renderMap(screen.map, sprites)
}

export function onresize(screen, viewport) {
	screen.camera.width = viewport.width
	screen.camera.height = viewport.height
	screen.camera.zoom = viewport.scale
}

export function onpress(screen, pointer) {
	Camera.startPan(screen.camera)
	// call mode onpress hook
	let onpress = Modes[screen.mode.id].onpress
	if (onpress) {
		onpress(screen.mode, screen, pointer)
	}
}

export function onmove(screen, pointer) {
	// call mode onmove hook
	let onmove = Modes[screen.mode.id].onmove
	if (onmove) {
		onmove(screen.mode, screen, pointer)
	}
}

export function onrelease(screen, pointer) {
	// call mode onrelease hook
	let onrelease = Modes[screen.mode.id].onrelease
	if (onrelease) {
		onrelease(screen.mode, screen, pointer)
	}
}

export function onupdate(screen) {
	let { mode, nextMode } = screen

	screen.time++
	updateCamera(screen)
	updateAnims(screen)

	// update components
	screen.dirty |= updateMode(mode)
	if (nextMode) {
		screen.dirty |= updateMode(nextMode)
		if (!mode.comps.length && nextMode) {
			switchMode(screen)
		}
	}

	if (mode.commands.length) {
		let command = mode.commands.shift()
		if (command.type === "move") {
			Game.move(command.unit, command.dest, screen.state)
		} else if (command.type === "attack") {
			// Game.attack(unit, enemy)
		} else if (command.type === "endTurn") {
			Game.endTurn(command.unit, screen.state)
		} else if (command.type === "switchMode") {
			if (!nextMode) {
				transition(screen, command.mode, command.data)
			}
		}
	}

	// call mode onupdate hook
	let onupdate = Modes[mode.id].onupdate
	if (onupdate) {
		onupdate(mode, screen)
	}
}

export function updateCamera(screen) {
	let camera = screen.camera
	let cache = screen.cache
	if (Math.round(cache.camera.x) !== Math.round(camera.pos.x)
	|| Math.round(cache.camera.y) !== Math.round(camera.pos.y)) {
		cache.camera.x = camera.pos.x
		cache.camera.y = camera.pos.y
		screen.dirty = true
	}

	Camera.update(screen.camera)
}

export function updateAnims(screen) {
	for (let i = 0; i < screen.anims.length; i++) {
		let anim = screen.anims[i]
		if (anim.done) {
			screen.anims.splice(i--, 1)
		} else {
			Anims[anim.id].update(anim)
		}
		screen.dirty = true
	}
}

export function updateMode(mode) {
	let dirty = false
	let anim = mode.anim
	if (anim) {
		if (anim.done) {
			if (anim.onend) {
				anim.onend()
			}
			mode.anim = null
		} else {
			Anims[anim.id].update(anim)
		}
		dirty = true
	}

	for (let c = 0; c < mode.comps.length; c++) {
		let comp = mode.comps[c]
		let anim = comp.anim
		if (anim) {
			dirty = true
			if (anim.done) {
				comp.anim = null
			} else {
				Anims[anim.id].update(anim)
			}
		}
		if (!comp.anim && comp.exit) {
			mode.comps.splice(c--, 1)
		}
	}

	return dirty
}

function transition(screen, nextid, nextdata) {
	if (!Modes[nextid]) {
		throw new Error(`Attempting to switch to nonexistent mode ${nextid}`)
	}

	// call old mode onexit hook
	let onexit = Modes[screen.mode.id].onexit
	if (onexit) {
		onexit(screen.mode, screen)
	}

	// create new mode
	let next = screen.nextMode = Modes[nextid].create(nextdata)
	next.time = screen.time

	// switch immediately if not animating
	if (!screen.mode.comps.length) {
		switchMode(screen)
	}

	// call new mode onenter hook
	if (Modes[nextid].onenter) {
		Modes[nextid].onenter(next, screen)
	}

	// queue up redraw
	screen.dirty = true
}

function switchMode(screen) {
	screen.mode = screen.nextMode
	screen.nextMode = null
}

export function render(screen) {
	let nodes = []

	let { map, mode, nextMode, cache, camera } = screen
	let game = screen.data
	let sprites = screen.view.sprites
	let origin = camera.origin = getOrigin(map, screen.camera)

	if (Modes[mode.id].render) {
		let modenodes = Modes[mode.id].render(mode, screen)
		nodes.push(...modenodes)
	}

	// queue map
	nodes.push({
		image: map.image,
		layer: "map",
		x: origin.x,
		y: origin.y
	})

	// queue components
	let comps = mode.comps
	if (nextMode) {
		comps.push(...nextMode.comps)
	}
	for (let comp of comps) {
		let compnodes = Comps[comp.id].render(comp, screen)
		nodes.push(...compnodes)
	}

	// queue cursor

	// queue units
	for (let unit of map.units) {
		let sprite = sprites.pieces[unit.faction][unit.type]
		let cell = unit.cell
		let x = origin.x + cell.x * map.tilesize
		let y = origin.y + cell.y * map.tilesize
		let z = 0
		let piecelayer = "pieces"
		if (mode.id === "Select" && mode.unit === unit) {
			let anim = mode.anim
			if (anim) {
				if (anim.id === "PieceLift" || anim.id === "PieceDrop") {
					z = Math.round(anim.y)
					piecelayer = "selection"
				} else if (anim.id === "PieceMove") {
					x = origin.x + anim.cell.x * map.tilesize
					y = origin.y + anim.cell.y * map.tilesize
				}
			}
		}
		nodes.push({
			layer: piecelayer,
			image: sprite,
			x: x + 1,
			y: y - 1,
			z: z
		})
		nodes.push({
			layer: "shadows",
			image: sprites.pieces.shadow,
			x: x + 1,
			y: y + 3
		})
	}

	return nodes
}
