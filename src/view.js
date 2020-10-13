import findRange from "./game/range"
import * as Map from "./game/map"
import * as Unit from "./game/unit"
import * as Game from "./game"
import * as Cell from "../lib/cell"
import * as Canvas from "../lib/canvas"
import rgb from "../lib/rgb"
import pathfind from "../lib/pathfind"
import renderText from "./view/render-text"
import renderMap from "./view/render-map"
import renderTag from "./view/render-name-tag"
import renderPreview from "./view/render-preview"
import getGradient from "./view/hp-gradient"
import * as RenderHP from "./view/render-hp"
import * as RenderForecast from "./view/render-forecast"
import Anims from "./anims"
import lerp from "lerp"
const tilesize = 16

export function create(width, height, sprites) {
	return {
		native: { width, height },
		width: window.innerWidth,
		height: window.innerHeight,
		scale: 1,
		sprites: sprites,
		element: document.createElement("canvas"),
		game: null,
		state: {
			anims: [],
			time: 0,
			dirty: false,
			camera: {
				pos: { x: 0, y: 0 },
				vel: { x: 0, y: 0 },
				target: { x: 0, y: 0 }
			},
			selection: null,
			target: null,
			screen: "select",
			pointer: {
				pos: null,
				time: 0,
				clicking: false,
				unit: false,
				select: false,
				pressed: null,
				offset: null
			}
		},
		cache: {
			map: null,
			camera: { x: 0, y: 0 },
			cursor: { x: 0, y: 0 },
			playerview: null,
			enemyview: null,
			vs: null,
			hp: null,
			forecast: null
		},
		layers: {
			map: [],
			range: [],
			shadows: [],
			pieces: [],
			markers: [],
			selection: [],
			mirage: [],
			ui: []
		}
	}
}

export function init(view, game) {
	let state = view.state
	let cache = view.cache
	let sprites = view.sprites
	let { camera, pointer, anims } = state

	let map = game.map
	view.game = game
	view.cache.map = renderMap(map, tilesize, sprites.palette)

	function onresize() {
		let scaleX = Math.max(1, Math.floor(window.innerWidth / view.native.width))
		let scaleY = Math.max(1, Math.floor(window.innerHeight / view.native.height))
		view.scale = Math.min(scaleX, scaleY)
		view.width = Math.ceil(window.innerWidth / view.scale)
		view.height = Math.ceil(window.innerHeight / view.scale)

		let canvas = view.element
		canvas.width = view.width
		canvas.height = view.height
		canvas.style.transform = `scale(${ view.scale })`
	}

	let device = null
	let events = {
		resize() {
			onresize()
			state.dirty = true
		},
		press(event) {
			if (!device) {
				device = switchDevice(event)
			}
			if (pointer.pressed) return false
			if (anims.find(anim => anim.blocking) || state.screen !== "select") {
				return false
			}
			pointer.time = state.time
			pointer.pos = getPosition(event)
			if (!pointer.pos) return false
			let cursor = snapToGrid(pointer.pos)
			pointer.clicking = true
			pointer.unit = Map.unitAt(map, cursor)
			pointer.pressed = pointer.pos
			pointer.offset = {
				x: camera.pos.x * view.scale,
				y: camera.pos.y * view.scale
			}
			if (!state.select) return
			let select = state.select
			let unit = select.unit
			let square = null
			// if unit hasn't moved yet
			if (game.phase.pending.includes(unit)) {
				let selecting = actions.hover(cursor)
				if (selecting) {
					pointer.select = true
				}
			}
		},
		move(event) {
			pointer.pos = getPosition(event)
			if (!pointer.pos || !pointer.pressed) return
			if (pointer.clicking) {
				let cursor = pointer.pos
				let origin = pointer.pressed
				if (Cell.distance(origin, cursor) > 4) {
					pointer.clicking = false
					pointer.unit = false
				}
			}
			if (anims.find(anim => anim.blocking)) {
				return
			}
			if (!pointer.select) {
				actions.panCamera(camera, pointer)
				return
			}
			let cursor = snapToGrid(pointer.pos)
			if (!Cell.equals(pointer.select, cursor)) {
				actions.hover(cursor)
			}
		},
		release(event) {
			if (!pointer.pressed) return false
			if (anims.find(anim => anim.blocking)) {
				return
			}
			let cursor = null
			if (pointer.clicking) {
				cursor = snapToGrid(pointer.pressed)
			}
			if (pointer.select) {
				cursor = snapToGrid(pointer.pos)
			}
			if (cursor) {
				let unit = Map.unitAt(map, cursor)
				if (state.select) {
					let select = state.select
					let unit = select.unit
					let square = null
					if (cache.range && game.phase.pending.includes(unit)) {
						square = cache.range.squares.find(({ cell }) => Cell.equals(cell, cursor))
					}
					if (square && select.path) {
						actions.move(unit, cursor)
					} else if (pointer.clicking) {
						actions.deselect()
					} else {
						actions.unhover()
					}
				} else if (unit) {
					actions.select(unit)
				}
			}
			pointer.clicking = false
			pointer.unit = null
			pointer.select = false
			pointer.pressed = null
		}
	}

	let actions = {
		select(unit) {
			let range = findRange(unit, map)
			let preview = renderPreview(unit, sprites)
			let expand = Anims.RangeExpand.create(range)
			let enter = Anims.PreviewEnter.create()
			let lift = Anims.PieceLift.create()
			state.anims.push(expand, enter, lift)
			state.select = {
				unit: unit,
				anim: lift,
				path: null,
				arrow: null,
				cursor: null,
				valid: false
			}
			cache.range = expand.range
			cache.playerview = {
				image: preview,
				anim: enter
			}
			if (!pointer.select && game.phase.pending.includes(unit)) {
				actions.centerCamera(unit.cell)
			}
		},
		deselect() {
			if (!state.select) return false
			let select = state.select
			select.anim.done = true
			if (cache.range) {
				let shrink = Anims.RangeShrink.create(cache.range)
				state.anims.push(shrink)
			}
			if (cache.playerview) {
				let exit = Anims.PreviewExit.create(cache.playerview.anim.x, "playerview")
				cache.playerview.anim.done = true
				cache.playerview.anim = exit
				state.anims.push(exit)
			}
			if (cache.enemyview) {
				let exit = Anims.PreviewExit.create(cache.enemyview.anim.x, "enemyview")
				cache.enemyview.anim.done = true
				cache.enemyview.anim = exit
				state.anims.push(exit)
				state.target = null
			}
			let drop = Anims.PieceDrop.create(select.anim.y)
			state.anims.push(drop)
			select.anim = drop
		},
		hover(cell) {
			let select = state.select
			let unit = select.unit
			if (select.cursor && Cell.equals(select.cursor.target, cell)) {
				return false
			}
			let square = cache.range.squares.find(square => {
				return Cell.equals(square.cell, cell)
				    && (square.type === "move" || square.type === "attack" && square.target)
			})
			let path = null
			if (square) {
				let target = cell
				let opts = {
					width: map.width,
					height: map.height,
					blacklist: map.units // make enemy units unwalkable
						.filter(other => !Unit.allied(unit, other))
						.map(unit => unit.cell)
				}
				// if there's an enemy in this square
				// (and no enemy is currently selected)
				if (square.target && !cache.enemyview) {
					// select enemy
					let unit = square.target
					let preview = renderPreview(unit, sprites)
					let enter = Anims.PreviewEnter.create()
					cache.enemyview = {
						image: preview,
						unit: unit,
						anim: enter
					}
					state.anims.push(enter)
					state.target = unit
				}
				// if we were selecting an enemy,
				// but now the current square is empty
				// or houses a different unit than before
				if (cache.enemyview
				&& (!square.target || square.target !== cache.enemyview.unit)
				) {
					// deselect enemy
					let exit = Anims.PreviewExit.create(cache.enemyview.anim.x, "enemyview")
					cache.enemyview.anim.done = true
					cache.enemyview.anim = exit
					state.anims.push(exit)
					state.target = null
				}
				// valid if tapping an adjacent enemy to attack
				if (square.target && !select.path && Cell.adjacent(unit.cell, target)) {
					path = [ unit.cell ]
				} else {
					let prev = select.path
						? select.path[select.path.length - 1]
						: unit.cell
					let range = Unit.rng(unit)
					if (square.type === "attack") {
						// if out of range
						if (Cell.distance(prev, cell) > range) {
							// prep closest attacking square for pathfinding
							let neighbors = Cell.neighborhood(cell, range)
								.sort((a, b) =>
									Cell.distance(a, unit.cell) - Cell.distance(b, unit.cell)
								)
							target = neighbors[0]
						} else if (!select.path) {
							// valid if tapping an enemy in range to attack
							path = [ unit.cell ]
						}
					}
					// if we still don't have a path,
					// the square covers one of three cases:
					// 1. it's an attack target, but out of range
					// 2. it's a move target, and we have a cached path to build off of
					// 3. it's a move target, and we don't have a cached path
					// the below conditional covers cases (1) and (2).
					if (!path && select.path) {
						let cached = select.path
						let prev = cached[cached.length - 1]
						if (square.type !== "attack" || Cell.distance(prev, cell) > range) {
							let addendum = pathfind(prev, target, opts)
							for (let i = addendum.length; --i >= 1;) {
								for (let j = 0; j < cached.length; j++) {
									if (Cell.equals(addendum[i], cached[j])) {
										path = cached.slice(0, j).concat(addendum.slice(i))
										break
									}
								}
								if (path) {
									break
								}
							}
							if (!path) {
								let backtrack = cached.find(cell => Cell.equals(cell, target))
								let length = cached.length + addendum.length - 2
								if (backtrack) {
									path = cached.slice(0, cached.indexOf(backtrack) + 1)
								} else if (length <= Unit.mov(unit)) {
									path = cached.concat(addendum.slice(1))
								}
							}
						} else {
							// is an attack square but in range;
							// use cached path
							path = cached
						}
					}
				}
				// case (3): no path yet. just do a full pathfind
				if (!path) {
					path = pathfind(unit.cell, target, opts)
				}
				if (path) {
					if (!select.cursor) {
						select.cursor = {
							pos: { x: cell.x * tilesize, y: cell.y * tilesize },
							target: cell
						}
					} else {
						select.cursor.target = cell
					}
					select.arrow = sprites.Arrow(path, unit.faction)
					select.path = path
					select.valid = true
					return true
				}
			}
			if (!path) {
				if (select.cursor) {
					select.cursor = null
					// select.cursor.target = cell
				}
				select.arrow = null
				select.path = null
				select.valid = false
				return false
			}
		},
		unhover() {
			let select = state.select
			select.cursor = null
			select.arrow = null
			select.path = null
			select.valid = false
		},
		move(unit, cursor) {
			if (!state.select) return false
			let select = state.select
			if (cache.range) {
				let shrink = Anims.RangeShrink.create(cache.range)
				state.anims.push(shrink)
			}
			if (select.path) {
				let move = Anims.PieceMove.create(select.path)
				select.anim.done = true
				select.anim = move
				state.anims.push(move)
			}
			if (pointer.clicking) {
				camera.follow = true
			} else {
				actions.centerCamera(cursor)
			}
		},
		panCamera(camera, pointer) {
			camera.target.x = (pointer.pos.x - pointer.pressed.x + pointer.offset.x) / view.scale
			camera.target.y = (pointer.pos.y - pointer.pressed.y + pointer.offset.y) / view.scale

			let left = view.width / 2
			let right = -view.width / 2
			let top = view.height / 2
			let bottom = -view.height / 2
			if (camera.target.x > left) {
				camera.target.x = left
			} else if (camera.target.x < right) {
				camera.target.x = right
			}
			if (camera.target.y > top) {
				camera.target.y = top
			} else if (camera.target.y < bottom) {
				camera.target.y = bottom
			}
		},
		centerCamera(cell) {
			camera.focus = cell
			camera.target.x = cache.map.width / 2 - (cell.x + 0.5) * tilesize
			camera.target.y = cache.map.height / 2 - (cell.y + 0.5) * tilesize
		}
	}

	function update() {
		state.time++
		if (state.dirty) {
			state.dirty = false
			render(view)
		}

		if (!state.select && !pointer.select && pointer.unit && state.time - pointer.time === 20) {
			if (game.phase.pending.includes(pointer.unit)) {
				pointer.select = true
			}
			actions.select(pointer.unit)
		}

		// center camera on moving pieces
		if (camera.follow && state.select && state.select.anim.type === "PieceMove") {
			let anim = state.select.anim
			actions.centerCamera(anim.cell)
		}

		// rerender if camera is at least a pixel off from its drawn position
		if (Math.round(cache.camera.x) !== Math.round(camera.pos.x)
		|| Math.round(cache.camera.y) !== Math.round(camera.pos.y)) {
			cache.camera.x = camera.pos.x
			cache.camera.y = camera.pos.y
			state.dirty = true
		}

		// update camera position
		camera.pos.x += camera.vel.x
		camera.pos.y += camera.vel.y
		camera.vel.x += ((camera.target.x - camera.pos.x) / 8 - camera.vel.x) / 2
		camera.vel.y += ((camera.target.y - camera.pos.y) / 8 - camera.vel.y) / 2

		// update cursor
		if (state.select && state.select.cursor) {
			let cursor = state.select.cursor
			if (Math.round(cache.cursor.x) !== Math.round(cursor.pos.x)
			|| Math.round(cache.cursor.y) !== Math.round(cursor.pos.y)) {
				cache.cursor.x = cursor.pos.x
				cache.cursor.y = cursor.pos.y
				state.dirty = true
			}
			cursor.pos.x += (cursor.target.x * tilesize - cursor.pos.x) / 4
			cursor.pos.y += (cursor.target.y * tilesize - cursor.pos.y) / 4
		}

		// handle animations
		for (let i = 0; i < state.anims.length; i++) {
			let anim = state.anims[i]
			if (anim.done) {
				state.anims.splice(i--, 1)
				// TODO: move these into actual hooks?
				// probably pass fns into anim data arg
				// and call from here if existent
				if (anim.type === "RangeShrink") {
					cache.range = null
				} else if (anim.type === "PreviewExit") {
					cache[anim.id] = null
				} else if (anim.type === "PieceDrop") {
					state.select = null
				} else if (anim.type === "PieceMove") {
					if (state.target) {
						state.screen = "attack"

						let enter = Anims.EaseOut.create(15)
						cache.vs = { anim: enter }
						state.anims.push(enter)

						let attacker = state.select.unit
						let defender = state.target
						let hpleft = RenderHP.attacker(attacker, sprites)
						let hpright = RenderHP.defender(defender, sprites)
						cache.hp = { left: hpleft, right: hpright }
						cache.forecast = {
							tags: {
								atk: renderTag(attacker.name, attacker.faction, sprites),
								def: renderTag(defender.name, defender.faction, sprites)
							},
							stats: {
								wpn: {
									image: RenderForecast.renderWeapon(attacker, defender, sprites),
									anim: (_ => {
										let anim = Anims.EaseOut.create(10, 10)
										state.anims.push(anim)
										return anim
									})()
								},
								dmg: {
									image: RenderForecast.renderDamage(attacker, defender, sprites),
									anim: (_ => {
										let anim = Anims.EaseOut.create(10, 13)
										state.anims.push(anim)
										return anim
									})()
								},
								hit: {
									image: RenderForecast.renderHit(attacker, defender, sprites),
									anim: (_ => {
										let anim = Anims.EaseOut.create(10, 16)
										state.anims.push(anim)
										return anim
									})()
								}
							}
						}
					}
					if (cache.playerview) {
						let exit = Anims.PreviewExit.create(cache.playerview.anim.x, "playerview")
						cache.playerview.anim.done = true
						cache.playerview.anim = exit
						state.anims.push(exit)
					}
					if (cache.enemyview) {
						let exit = Anims.PreviewExit.create(cache.enemyview.anim.x, "enemyview")
						cache.enemyview.anim.done = true
						cache.enemyview.anim = exit
						state.anims.push(exit)
					}
					let unit = state.select.unit
					Unit.move(unit, anim.cell, map)
					Game.endTurn(unit, game)
					state.select.anim = null
					if (camera.follow) {
						camera.follow = false
					}
					if (!state.target) {
						state.select = null
					}
				}
			}
			Anims[anim.type].update(anim)
			state.dirty = true
		}
		requestAnimationFrame(update)
	}

	function animating(anims, type) {
		if (!type) return !!anims.length
		for (let anim of anims) {
			if (anim.type === type) {
				return true
			}
		}
		return false
	}

	events.resize()
	window.addEventListener("resize", events.resize)
	window.addEventListener("mousedown", events.press)
	window.addEventListener("mousemove", events.move)
	window.addEventListener("mouseup", events.release)
	window.addEventListener("touchstart", events.press)
	window.addEventListener("touchmove", events.move)
	window.addEventListener("touchend", events.release)
	requestAnimationFrame(update)

	function switchDevice(event) {
		let device = "desktop"
		if (event.touches) {
			device = "mobile"
			window.removeEventListener("mousedown", events.press)
			window.removeEventListener("mousemove", events.move)
			window.removeEventListener("mouseup", events.release)
		} else {
			window.removeEventListener("touchstart", events.press)
			window.removeEventListener("touchmove", events.move)
			window.removeEventListener("touchend", events.release)
		}
		return device
	}

	// diagnoses the pointer position from an event.
	// detects both clicks and taps
	function getPosition(event) {
		let x = event.pageX || event.touches && event.touches[0].pageX
		let y = event.pageY || event.touches && event.touches[0].pageY
		if (x === undefined || y === undefined) return null
		return { x, y }
	}

	function snapToGrid(pos) {
		let map = game.map
		// undo scaling
		let realpos = {
			x: (pos.x - window.innerWidth / 2) / view.scale,
			y: (pos.y - window.innerHeight / 2) / view.scale,
		}
		// relative to top left corner of map
		let gridpos = {
			x: realpos.x + map.width * tilesize / 2 - camera.pos.x,
			y: realpos.y + map.height * tilesize / 2 - camera.pos.y,
		}
		// fix to tiles
		return {
			x: Math.floor(gridpos.x / tilesize),
			y: Math.floor(gridpos.y / tilesize)
		}
	}
}

export function render(view) {
	let sprites = view.sprites
	let palette = sprites.palette
	let state = view.state
	let cache = view.cache
	let canvas = view.element
	let layers = view.layers
	let game = view.game
	let context = canvas.getContext("2d")
	context.fillStyle = "black"
	context.fillRect(0, 0, canvas.width, canvas.height)

	// find top left corner of grid for drawing grid-bound elements
	let { camera, pointer, select } = state
	let origin = findOrigin(view)

	// clear layers
	for (let name in layers) {
		layers[name].length = 0
	}

	// queue map
	layers.map.push({ image: cache.map, x: origin.x, y: origin.y })

	// queue range
	if (cache.range) {
		for (let square of cache.range.squares) {
			let sprite = sprites.squares[square.type]
			let x = origin.x + square.cell.x * tilesize
			let y = origin.y + square.cell.y * tilesize
			layers.range.push({ image: sprite, x, y })
		}
	}

	// queue cursor
	if (select && select.cursor
	&& (!select.anim || select.anim && select.anim.type !== "PieceMove")
	&& select.valid
	&& !Cell.equals(select.cursor.target, select.unit.cell)
	&& Map.contains(game.map, select.cursor.target)
	) {
		let sprite = sprites.select.cursor[game.phase.faction]
		let x = origin.x + select.cursor.pos.x - 1
		let y = origin.y + select.cursor.pos.y - 1
		layers.selection.push({ image: sprite, x, y })
	}

	// queue arrow
	if (select && select.path
	&& (select.anim && (select.anim.type !== "PieceMove" || state.time % 2))) {
		for (let node of select.arrow) {
			let image = node.image
			let x = origin.x + node.x
			let y = origin.y + node.y
			layers.markers.push({ image, x, y })
		}
	}

	// queue units
	for (let unit of game.map.units) {
		let sprite = sprites.pieces[unit.faction][unit.type]
		let cell = unit.cell
		let x = origin.x + cell.x * tilesize
		let y = origin.y + cell.y * tilesize
		let z = 0
		let layer = null
		if (game.phase.faction === unit.faction) {
			if (game.phase.pending.includes(unit)) {
				if (!select || select.unit !== unit) {
					let glow = sprites.select.glow[unit.faction]
					layers.pieces.push({ image: glow, x, y: y - 2, z })
				}
			} else {
				sprite = sprites.pieces.done[unit.faction][unit.type]
			}
		}
		if (select && select.unit === unit) {
			let anim = select.anim
			if (anim) {
				if (anim.type !== "PieceMove" || state.time % 2) {
					let ring = sprites.select.ring[unit.faction]
					layers.markers.push({ image: ring, x: x - 2, y: y - 2, z: 0 })
				}
				if (anim.type === "PieceMove") {
					x = origin.x + anim.cell.x * tilesize
					y = origin.y + anim.cell.y * tilesize
				} else {
					z = Math.round(anim.y)
				}
			}
			layer = "selection"
		} else {
			layer = "pieces"
		}
		layers[layer].push({
			image: sprite,
			x: x + 1,
			y: y - 1,
			z: z
		})
		layers.shadows.push({
			image: sprites.pieces.shadow,
			x: x + 1,
			y: y + 3
		})
	}

	// queue unit mirage
	if (pointer.select
	// && select.cursor
	// && !Cell.equals(select.cursor.target, select.unit.cell)
	) {
		let unit = select.unit
		let image = sprites.pieces[unit.faction][unit.type]
		let x = pointer.pos.x / view.scale - image.width / 2
		let y = pointer.pos.y / view.scale - image.height - 8
		let opacity = 0.75
		if (!select.valid) {
			opacity = 0.25
		}
		if (opacity) {
			layers.mirage.push({ image, x, y, opacity })
		}
	}

	// queue unit preview
	if (cache.playerview) {
		const margin = 2
		let preview = cache.playerview
		let x = lerp(-preview.image.width, margin, preview.anim.x)
		let y = view.height - preview.image.height - margin + 1
		layers.ui.push({ image: preview.image, x, y })
	}

	if (cache.enemyview) {
		const margin = 2
		let preview = cache.enemyview
		let width = preview.image.width - 1
		let x = view.width + lerp(width, -margin - width, preview.anim.x)
		let y = view.height - preview.image.height - margin + 1
		layers.ui.push({ image: preview.image, x, y })
	}

	if (cache.vs) {
		let vs = sprites.vs
		let width = vs.width * cache.vs.anim.x
		let x = view.width / 2 - width  / 2
		let y = view.height * 3 / 4 - vs.height / 2
		layers.ui.push({ image: vs, x, y, width })

		let hpleft = cache.hp.left
		x = lerp(-hpleft.width, 4, cache.vs.anim.x) + 1
		y = y + 22
		layers.ui.unshift({ image: hpleft, x, y })

		let hpright = cache.hp.right
		x = view.width + lerp(hpright.width, -4 - hpright.width, cache.vs.anim.x) + 1
		layers.ui.unshift({ image: hpright, x, y })

		let atktag = cache.forecast.tags.atk
		x = lerp(-atktag.width, 4, cache.vs.anim.x) + 1
		y = y - atktag.height - 1
		layers.ui.unshift({ image: atktag, x, y })

		let deftag = cache.forecast.tags.def
		x = view.width + lerp(deftag.width, -4 - deftag.width, cache.vs.anim.x) + 1
		layers.ui.unshift({ image: deftag, x, y })

		let cached = cache.forecast
		let stats = Object.keys(cached.stats)
		for (let i = 0; i < stats.length; i++) {
			let key = stats[i]
			let data = cached.stats[key]
			let image = data.image
			let height = image.height * data.anim.x
			let x = view.width / 2 - image.width / 2
			let y = view.height * 3 / 4 + 28 + 14 * i - height / 2
			layers.ui.push({ image, x, y, height })
		}

		// let text = renderText(
		// 	`Select a techw to use, then tap "GO" to initiate combat.`,
		// 	sprites.fonts.standard
		// )
		// x = 3
		// y = view.height - text.height - 1
		// layers.ui.push({ image: text, x, y })
	}

	// render layers
	for (let layername in layers) {
		let layer = layers[layername]
		if (layername !== "ui") {
			layer.sort(zsort)
		}
		for (let node of layer) {
			let image = node.image
			let x = Math.round(node.x)
			let y = Math.round(node.y - (node.z || 0))
			let width = Math.round(node.width)
			let height = Math.round(node.height)
			if (width === 0 || height === 0) {
				continue
			}
			if (!width) width = image.width
			if (!height) height = image.height
			if (node.opacity !== undefined) {
				context.globalAlpha = node.opacity
				context.drawImage(image, x, y, width, height)
				context.globalAlpha = 1
			} else {
				context.drawImage(image, x, y, width, height)
			}
		}
	}
}

function zsort(a, b) {
	return (a.y + a.image.height / 2) - (b.y + b.image.height / 2)
}

function findOrigin(view) {
	return {
		x: view.width / 2 - view.cache.map.width / 2 + view.state.camera.pos.x,
		y: view.height / 2 - view.cache.map.width / 2 + view.state.camera.pos.y
	}
}
