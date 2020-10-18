import * as Anims from "../anims"
import * as Camera from "./camera"
import * as Comps from "./comps"
import * as Modes from "./modes"
import * as Unit from "./unit"
import * as Game from "./game"
import renderMap from "../view/render-map"
import contains from "../view/bbox-contains"
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
		nextmode: null,
		commands: [],
		comps: [],
		anims: [],
		view: null,
		time: 0,
		wait: 0,
		dirty: false,
		camera: Camera.create(),
		map: Object.assign({ tilesize, image: null }, data.map),
		data: data,
		cache: {
			camera: { x: 0, y: 0 },
			phase: "player",
			units: data.map.units.slice(),
			unitcell: null
		}
	}
}

export function onenter(screen, view) {
	let sprites = view.sprites
	screen.view = view
	screen.map.image = renderMap(screen.map, sprites)

	let unit = screen.data.phase.pending[0]
	Camera.center(screen.camera, screen.map, unit.cell)
	Camera.reset(screen.camera)
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
	if (pointer.mode === "click") {
		// scale down pointer pos
		// we could use another field or function for this
		let viewport = screen.view.viewport
		let pos = {
			x: pointer.pos.x / viewport.scale,
			y: pointer.pos.y / viewport.scale
		}

		let comps = screen.mode.comps
		// do we need to add components from the mode transitioning in?
		// probably not, because they're animating
		// if (screen.nextmode) {
		// 	comps = comps.concat(screen.nextmode.comps)
		// }
		let comp = comps.find(comp => comp.bbox && contains(pos, comp.bbox))
		if (comp) {
			Comps[comp.id].onclick(comp, screen)
			return // block mode onrelease hook
		}
	}

	// call mode onrelease hook
	let onrelease = Modes[screen.mode.id].onrelease
	if (onrelease) {
		onrelease(screen.mode, screen, pointer)
	}
}

export function onupdate(screen) {
	let { mode, nextmode } = screen

	screen.time++
	screen.wait = Math.max(0, screen.wait - 1)
	updateCamera(screen)

	let busy = screen.anims.find(anim => anim.blocking)
		|| mode.comps.filter(comp => comp.exit && comp.blocking).length
		|| screen.wait

	// update components
	screen.dirty |= updateAnims(screen)
	screen.dirty |= updateModeAnims(mode, screen)
	screen.dirty |= updateModeComps(mode, screen)
	if (nextmode) {
		screen.dirty |= updateModeComps(nextmode, screen)
		if (!busy && nextmode) {
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

	busy = screen.anims.find(anim => anim.blocking)
		|| mode.id === "Attack" && !mode.exit
		|| mode.comps.filter(comp => comp.exit && comp.blocking).length
		|| screen.wait
	if (busy) return
	if (screen.commands.length) {
		let command = screen.commands.shift()
		console.log(screen.time, "cmd screen", command)
		if (command.type === "move") {
			move(command.unit, command.path, screen)
		} else if (command.type === "attack") {
			attack(command.attack.source, command.attack, screen)
		} else if (command.type === "endTurn") {
			endTurn(command.unit, screen)
		} else if (command.type === "cancel") {
			cancel(command.unit, screen)
			if (!nextmode) {
				transition(screen, "Home")
			}
		} else if (command.type === "switchMode") {
			if (!nextmode) {
				transition(screen, command.mode, command.data)
			}
		}
	} else if (mode.id !== "Home" && mode.id !== "Forecast" && mode.id !== "Select") {
		if (!nextmode) {
			transition(screen, "Home")
		}
	}
}

function cancel(unit, screen) {
	let cache = screen.cache
	let game = screen.data
	if (!cache.unitcell) {
		throw new Error("Failed to cancel selection: No origin cell in memory")
	}
	Game.move(unit, cache.unitcell, game)
	cache.unitcell = null
}

function move(unit, path, screen) {
	// animate piece movement
	let move = Anims.PieceMove.create(path, { unit, onend })
	screen.anims.push(move)
	screen.cache.unitcell = unit.cell
	// completion handler
	function onend() {
		let dest = path[path.length - 1]
		Game.move(unit, dest, screen.data)
		let command = screen.commands[0]
		let acting = command && command.unit === unit
		let phase = screen.data.phase
		if (phase.faction === "enemy" && !acting || screen.mode.id === "Forecast") {
			console.log("ending turn from move", unit)
			endTurn(unit, screen)
		}
	}
}

function attack(unit, attack, screen) {
	transition(screen, "Attack", { attack, onend() {
		let removal = Game.attack(attack, screen.data)
		if (removal) {
			let fade = Anims.PieceFade.create({ unit: removal })
			screen.anims.push(fade)
		}
		console.log("commands left", ...screen.commands)
		let command = screen.commands[0]
		if (!command || command.unit !== unit) {
			console.log("ending turn from attack", attack.source)
			endTurn(attack.source, screen)
		}
		if (!screen.commands.length
		|| !(screen.commands[0] && screen.commands[0].type === "attack")
		// && !(screen.commands[1] && screen.commands[1].type === "attack")
		) {
			if (!screen.nextmode) {
				transition(screen, "Home")
			}
		}
	} })
}

function endTurn(unit, screen) {
	let game = screen.data
	let phase = game.phase
	let cache = screen.cache
	Game.endTurn(unit, screen.data)

	// we don't need to remember the cell we moved from anymore
	// unless we're adding undo states :flushed:
	cache.unitcell = null

	console.log("ended", unit.name + "'s turn")
	console.log(phase.pending.map(unit => unit.name).join(", "), "remains")

	console.log("commands left", ...screen.commands)
	if (!screen.commands.length) {
		screen.commands.push({
			type: "switchMode",
			mode: "Home"
		})
	}

	// only continue if phase has changed
	if (phase.faction === cache.phase) return
	cache.phase = phase.faction
	// wait(10, screen)

	if (phase.faction === "enemy" && phase.pending.length) {
		let cmd = initAi(screen)
		screen.commands.push(...cmd)
		// do not center camera if ai hasn't inputted any commands
		// prevents screen swing on phase complete
		if (!cmd.length) return
	}

	let next = phase.pending[0]
	if (next) {
		Camera.center(screen.camera, screen.map, next.cell)
	}
}

// initAi(game) -> commandlist
// > returns a list of commands for all
// > pending units in the current phase
// > has side effect of ending turns
// > is there a better way of doing this?
function initAi(screen) {
	let cmd = []
	let game = screen.data
	let map = game.map
	let phase = game.phase
	let strategy = analyze(map, phase.pending)
	let stratmap = new Map()
	for (let i = 0; i < strategy.length; i++) {
		let commands = strategy[i]
		let unit = phase.pending[i]
		stratmap.set(unit, commands)
	}
	for (let [ unit, commands ] of stratmap) {
		console.log(unit.name, ...commands)
		if (!commands.length) {
			console.log("no commands for", unit.name)
			endTurn(unit, screen)
		} else {
			cmd.push(...commands)
		}
	}
	return cmd
}

function wait(time, screen) {
	screen.wait = time
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

function updateAnims(screen) {
	let dirty = false
	for (let i = 0; i < screen.anims.length; i++) {
		let anim = screen.anims[i]
		if (anim.done) {
			screen.anims.splice(i--, 1)
			let onend = anim.opts && anim.opts.onend
			if (onend) {
				onend()
			}
		} else {
			Anims[anim.id].update(anim)
		}
		dirty = true
	}
	return dirty
}

function updateModeAnims(mode, screen) {
	if (mode.anims.length) {
		screen.anims.push(...mode.anims)
		mode.anims.length = 0
		return true
	}
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

	// create new mode
	let next = screen.nextmode = Modes[nextid].create(nextdata)
	next.time = screen.time

	// call old mode onexit hooks
	let onexit = Modes[mode.id].onexit
	if (onexit) {
		onexit(mode, screen)
	}
	mode.exit = true

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
	screen.mode = screen.nextmode
	screen.nextmode = null
	screen.dirty = true
}

export function render(screen) {
	let nodes = []

	let { map, mode, nextmode, cache, camera } = screen
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
	if (nextmode) {
		comps.push(...nextmode.comps)
	}
	for (let comp of comps) {
		let compnodes = Comps[comp.id].render(comp, screen)
		nodes.push(...compnodes)
	}

	// queue cursor

	// queue units
	let select = mode.id === "Select" || mode.id === "Forecast" || mode.id === "Attack"
	for (let unit of map.units) {
		if (screen.anims.find(anim => anim.opts && anim.opts.unit === unit)) {
			continue
		}
		let sprite = sprites.pieces[unit.control.faction][unit.type]
		let cell = unit.cell
		let x = origin.x + cell.x * map.tilesize
		let y = origin.y + cell.y * map.tilesize
		let z = 0
		if (game.phase.faction === "player" && unit.control.faction === "player") {
			if (game.phase.pending.includes(unit)) {
				if (!(mode.unit === unit || mode.target === unit)) {
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
	for (let anim of screen.anims) {
		let unit = anim.opts.unit
		let sprite = sprites.pieces[unit.control.faction][unit.type]
		let cell = anim.cell || anim.opts.unit.cell
		let x = origin.x + cell.x * map.tilesize
		let y = origin.y + cell.y * map.tilesize
		let z = 0
		if (anim.id === "PieceLift" || anim.id === "PieceDrop") {
			z = Math.round(anim.y)
		}
		// if (anim.id === "PieceDrop" && game.phase.pending.includes(unit)) {
		// 	nodes.push({
		// 		layer: "pieces",
		// 		image: sprites.select.glow[unit.control.faction],
		// 		x: x,
		// 		y: y - 2,
		// 		z: z
		// 	})
		// }
		if (anim.id === "PieceFlinch" && !anim.flashing) {
			sprite = sprites.pieces.flash
		}
		if (anim.id === "PieceFade" && !anim.visible) {
			continue
		}
		if (anim.id === "PieceMove"
		|| anim.id === "PieceAttack"
		|| anim.id === "PieceFlinch"
		) {
			x = origin.x + anim.cell.x * map.tilesize
			y = origin.y + anim.cell.y * map.tilesize
		}
		if (anim.id === "PieceMove") {
			Camera.center(camera, map, anim.cell)
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
