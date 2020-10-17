import * as Anims from "../anims"
import * as Camera from "./camera"
import * as Comps from "./comps"
import * as Modes from "./modes"
import * as Unit from "./unit"
import * as Game from "./game"
import renderMap from "../view/render-map"
import getOrigin from "../helpers/get-origin"
import analyze from "./ai"

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
		commands: [],
		comps: [],
		anim: null,
		view: null,
		time: 0,
		dirty: false,
		camera: Camera.create(),
		map: Object.assign({ tilesize, image: null }, data.map),
		data: data,
		cache: {
			camera: { x: 0, y: 0 },
			phase: "player"
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
	// call mode onresize hook
	let onresize = Modes[screen.mode.id].onresize
	if (onresize) {
		onresize(screen.mode, viewport)
	}
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

	let anim = screen.mode.anim
	let busy = anim && anim.blocking
		|| mode.comps.filter(comp => comp.exit && comp.blocking).length

	// update components
	screen.dirty |= updateModeAnim(mode)
	screen.dirty |= updateModeComps(mode, screen)
	if (nextMode) {
		screen.dirty |= updateModeComps(nextMode, screen)
		if (!busy && nextMode) {
			switchMode(screen)
		}
	}

	// call mode onupdate hook
	let onupdate = Modes[mode.id].onupdate
	if (onupdate) {
		onupdate(mode, screen)
	}

	if (mode.commands.length) {
		let command = mode.commands.shift()
		console.log(screen.time, "cmd mode " + mode.id, command)
		if (command.type === "select") {
			screen.commands.push({ type: "switchMode", mode: "Select", data: command.data })
		} else if (command.type === "forecast") {
			screen.commands.push({
				type: "switchMode",
				mode: "Forecast",
				data: { unit: command.unit, target: command.target }
			})
		} else if (command.type === "cancel") {
			screen.commands.push({ type: "switchMode", mode: "Home" })
		} else {
			screen.commands.push(command)
		}
	}

	anim = screen.mode.anim
	busy = anim && anim.blocking
		|| mode.id === "Attack" && !mode.exit
		|| mode.comps.filter(comp => comp.exit && comp.blocking).length
	if (busy) return
	if (screen.commands.length) {
		let command = screen.commands.shift()
		console.log(screen.time, "cmd screen", command)
		if (command.type === "move") {
			move(command.unit, command.path, screen)
		} else if (command.type === "attack") {
			attack(command.unit, command.attack, screen)
		} else if (command.type === "endTurn") {
			endTurn(command.unit, screen)
		} else if (command.type === "switchMode") {
			if (!nextMode) {
				transition(screen, command.mode, command.data)
			}
		}
	} else if (screen.data.phase.faction === "enemy") {

	}
}

function move(unit, path, screen) {
	// animate piece movement
	screen.mode.anim = Anims.PieceMove.create(path, { onend() {
		let dest = path[path.length - 1]
		Game.move(unit, dest, screen.data)
	} })
}

function attack(unit, attack, screen) {
	transition(screen, "Attack", { attack, onend() {
		console.log(...screen.commands.map(cmd => cmd.type))
		Game.attack(attack, screen.data)
		if (!screen.commands.length) {
			screen.commands.push({
				type: "switchMode",
				mode: "Home"
			})
		}
	} })
}

function endTurn(unit, screen) {
	let game = screen.data
	let cache = screen.cache
	let phase = game.phase
	Game.endTurn(unit, screen.data)
	screen.commands.push({
		type: "switchMode",
		mode: "Home"
	})

	console.log("ended", unit.name + "'s turn")
	console.log(phase.pending.map(unit => unit.name).join(", "), "remains")

	// if phase has changed
	let newphase = phase.faction !== cache.phase
	if (newphase) cache.phase = phase.faction
	if (!newphase || phase.faction !== "enemy" || !phase.pending.length) {
		return
	}
	console.log("phase switched")
	let strategy = analyze(game.map, phase.pending)
	let stratmap = new Map()
	for (let i = 0; i < strategy.length; i++) {
		let commands = strategy[i]
		let unit = phase.pending[i]
		stratmap.set(unit, commands)
	}
	for (let [ unit, commands ] of stratmap) {
		console.log(unit.name, commands)
		if (commands.length) {
			screen.commands.push(...commands)
		} else {
			console.log("no commands for", unit.name)
			Game.endTurn(unit, screen.data)
		}
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

function updateModeAnim(mode) {
	let dirty = false
	let anim = mode.anim
	if (anim) {
		if (anim.done) {
			let onend = anim.data && anim.data.onend
			if (onend) {
				onend()
			}
			mode.anim = null
		} else {
			Anims[anim.id].update(anim)
		}
		dirty = true
	}
	return dirty
}

function updateModeComps(mode, screen) {
	let dirty = false

	// if (mode.comps.length) {
	// 	console.warn(mode.id, mode.comps.map(comp => comp.id).join(" "))
	// }

	for (let c = 0; c < mode.comps.length; c++) {
		let comp = mode.comps[c]
		let anim = comp.anim
		if (anim) {
			if (anim.done) {
				comp.anim = null
			} else {
				Anims[anim.id].update(anim)
			}
			dirty = true
		}
		if (!comp.anim && comp.exit) {
			mode.comps.splice(c--, 1)
		} else if (Comps[comp.id].onupdate) {
			Comps[comp.id].onupdate(comp, screen)
		}
	}

	return dirty
}

function transition(screen, nextid, nextdata) {
	if (!Modes[nextid]) {
		throw new Error(`Attempting to switch to nonexistent mode ${nextid}`)
	}

	let mode = screen.mode

	// call old mode onexit hooks
	let onexit = Modes[mode.id].onexit
	if (onexit) {
		onexit(mode, screen)
	}
	mode.exit = true

	// create new mode
	let next = screen.nextMode = Modes[nextid].create(nextdata)
	next.time = screen.time

	// pass persistent components to next mode
	for (let c = 0; c < mode.comps.length; c++) {
		let comp = mode.comps[c]
		if (comp.persist) {
			// can we remove persistent flag after one carry?
			comp.persist = false
			mode.comps.splice(c--, 1)
			next.comps.push(comp)
		}
	}

	// close remaining components
	for (let comp of mode.comps) {
		Comps[comp.id].exit(comp)
	}

	// switch immediately if not animating
	if (!mode.comps.filter(comp => comp.exit && comp.blocking).length) {
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
	screen.dirty = true
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
	let comps = mode.comps.slice()
	if (nextMode) {
		comps.push(...nextMode.comps)
	}
	for (let comp of comps) {
		let compnodes = Comps[comp.id].render(comp, screen)
		nodes.push(...compnodes)
	}

	// queue cursor

	// queue units
	let select = mode.id === "Select" || mode.id === "Forecast" || mode.id === "Attack"
	for (let unit of map.units) {
		if (select && mode.unit === unit) {
			continue
		}
		let sprite = sprites.pieces[unit.control.faction][unit.type]
		let cell = unit.cell
		let x = origin.x + cell.x * map.tilesize
		let y = origin.y + cell.y * map.tilesize
		let z = 0
		if (game.phase.faction === "player" && unit.control.faction === "player") {
			if (game.phase.pending.includes(unit)) {
				if (!select || mode.unit !== unit && mode.target !== unit || mode.exit) {
					nodes.push({
						layer: "pieces",
						image: sprites.select.glow[unit.control.faction],
						x: x,
						y: y - 2
					})
				}
			} else if (!select || mode.unit !== unit && mode.target !== unit) {
				sprite = sprites.pieces.done[unit.control.faction][unit.type]
			}
		}
		nodes.push({
			layer: "pieces",
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

	// queue selection
	if (select) {
		let unit = mode.unit
		let sprite = sprites.pieces[unit.control.faction][unit.type]
		let cell = unit.cell
		let x = origin.x + cell.x * map.tilesize
		let y = origin.y + cell.y * map.tilesize
		let z = 0
		let anim = mode.anim
		if (anim) {
			if (anim.id === "PieceLift" || anim.id === "PieceDrop") {
				z = Math.round(anim.y)
			} else if (anim.id === "PieceMove" || anim.id === "PieceAttack") {
				x = origin.x + anim.cell.x * map.tilesize
				y = origin.y + anim.cell.y * map.tilesize
				if (anim.id === "PieceMove") {
					Camera.center(camera, map, anim.cell)
				}
			}
		}
		nodes.push({
			layer: "selection",
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
