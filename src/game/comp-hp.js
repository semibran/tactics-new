import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import * as RenderHP from "../view/render-hp"
import * as Config from "./config"
import earlyExit from "../helpers/early-exit"
import rgb from "../../lib/rgb"
import lerp from "lerp"

const enterDuration = 15
const exitDuration = 7

export function create(value, max, faction, opts) {
	return {
		id: "Hp",
		value: value,
		max: max,
		faction: faction,
		opts: Object.assign({ flipped: false }, opts),
		anim: EaseOut.create(enterDuration),
		mode: { type: "static" },
		persist: true,
		blocking: true,
		init: false,
		exit: false,
		cache: { image: null, full: null, damaged: null, chunk: null }
	}
}

export function exit(hp) {
	let src = hp.anim ? hp.anim.x : 1
	let duration = hp.anim
		? earlyExit(exitDuration, hp.anim.x)
		: exitDuration
	hp.anim = EaseLinear.create(duration, { src, dest: 0 })
	hp.exit = true
}

export function onupdate(hp) {
	let anim = hp.mode.anim
	if (!anim) return
	if (anim.done) {
		endReduce(hp)
	} else {
		EaseLinear.update(anim)
	}
}

export function startReduce(hp, damage) {
	hp.mode = {
		type: "reduce",
		anim: EaseLinear.create(20, { delay: 10 }),
		damage: Math.min(hp.value, damage)
	}
}

export function endReduce(hp) {
	hp.cache.image = hp.cache.damaged
	hp.value -= hp.mode.damage
	hp.mode = { type: "static" }
}

export function startFlash(hp, damage) {
	hp.mode = {
		type: "flash",
		damage: Math.min(hp.value, damage)
	}
}

export function render(hp, screen) {
	let nodes = []


	const viewport = screen.view.viewport
	const sprites = screen.view.sprites
	const palette = sprites.palette
	const side = !hp.opts.flipped ? "left" : "right"

	let origin = "topright"
	let start = 0
	let goal = viewport.width / 2 - 10
	if (side === "right") {
		origin = "topleft"
		start = viewport.width
		goal = viewport.width / 2 + 10
	}

	let anim = hp.anim
	let x = anim ? lerp(start, goal, anim.x) : goal
	let y = viewport.height - Config.forecastOffset
	let image = hp.cache.image
	if (!image) {
		image = RenderHP[side](hp.value, hp.max, hp.faction, sprites)
		hp.cache.image = image
		hp.cache.full = image
	}

	if (hp.mode.type === "flash") {
		let chunk = hp.cache.chunk
		if (!chunk) {
			let damage = Math.min(hp.mode.damage, hp.value)
			let value = hp.value - damage
			let hpmax = hp.max
			chunk = hp.cache.chunk = RenderHP[side + "Chunk"](damage, value, hpmax, sprites)
		}
		let d = screen.time % 75 / 75

		const max = 1
		const min = 0.25
		let opacity = (Math.sin(2 * Math.PI * d) + 1) / 2 * (max - min) + min

		screen.dirty = true
		nodes.push({
			layer: "ui",
			image: chunk,
			x, y, origin, opacity
		})
	}

	if (hp.mode.type === "reduce" && hp.mode.anim) {
		let color = screen.time % 2
			? rgb(...palette.red)
			: rgb(...palette.white)
		let value = lerp(hp.mode.damage, 0, hp.mode.anim.x)
		let inval = lerp(0, hp.mode.damage, hp.mode.anim.x)
		let chunk = RenderHP[side + "Chunk"](value, hp.value - hp.mode.damage, hp.max, sprites, color)
		image = hp.cache.damaged = RenderHP[side](hp.value - inval, hp.max, hp.faction, sprites)
		nodes.push({
			layer: "ui",
			image: chunk,
			x, y, origin
		})
	}

	nodes.unshift({
		layer: "ui",
		image, x, y, origin
	})

	return nodes
}
