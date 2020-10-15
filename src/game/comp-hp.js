import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import * as RenderHP from "../view/render-hp"
import * as Config from "./config"
import earlyExit from "../helpers/early-exit"
import lerp from "lerp"

const enterDuration = 15
const exitDuration = 7

export function create(maxhp, damage, faction, sprites, defending) {
	let full = null
	let damaged = null
	let chunk = null
	if (!defending) {
		full = RenderHP.attacker(maxhp, 0, faction, sprites)
		damaged = damage ? RenderHP.attacker(maxhp, damage, faction, sprites) : full
		chunk = damage && RenderHP.attackerChunk(maxhp, damage, sprites)
	} else {
		full = RenderHP.defender(maxhp, 0, faction, sprites)
		damaged = damage ? RenderHP.defender(maxhp, damage, faction, sprites) : full
		chunk = damage && RenderHP.defenderChunk(maxhp, damage, sprites)
	}
	return {
		id: "Hp",
		anim: EaseOut.create(enterDuration),
		cache: { full, damaged, chunk },
		flipped: !!defending,
		mode: "flash",
		persist: true,
		exit: false
	}
}

export function exit(hp) {
	let src = hp.anim ? hp.anim.x : 1
	let duration = hp.anim
		? earlyExit(exitDuration, hp.anim.x)
		: exitDuration
	hp.anim = EaseLinear.create(duration, src, 0)
	hp.exit = true
}

export function render(hp, screen) {
	let nodes = []

	let origin = "topright"
	let start = 0
	let goal = screen.camera.width / 2 - 10
	if (hp.flipped) {
		origin = "topleft"
		start = screen.camera.width
		goal = screen.camera.width / 2 + 10
	}

	let anim = hp.anim
	let x = anim ? lerp(start, goal, anim.x) : goal
	let y = screen.camera.height - Config.forecastOffset
	let image = hp.cache.full
	if (hp.mode === "flash") {
		image = hp.cache.full
		if (hp.cache.chunk) {
			let d = screen.time % 60 / 60
			let opacity = (Math.sin(2 * Math.PI * d) + 1) / 2 * 0.75
			screen.dirty = true
			nodes.push({
				layer: "ui",
				image: hp.cache.chunk,
				x, y, origin, opacity
			})
		}
	} else {
		image = hp.cache.full
	}

	nodes.unshift({
		layer: "ui",
		image, x, y, origin
	})

	return nodes
}
