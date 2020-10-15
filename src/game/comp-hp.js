import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import * as RenderHP from "../view/render-hp"
import * as Config from "./config"
import earlyExit from "../helpers/early-exit"
import lerp from "lerp"

const enterDuration = 15
const exitDuration = 7

export function create(maxhp, damage, faction, sprites, defending) {
	let image = !defending
		? RenderHP.attacker(maxhp, damage, faction, sprites)
		: RenderHP.defender(maxhp, damage, faction, sprites)
	let chunk = !defending
		? RenderHP.attackerChunk(maxhp, damage, sprites)
		: RenderHP.defenderChunk(maxhp, damage, sprites)
	return {
		id: "Hp",
		anim: EaseOut.create(enterDuration),
		image: image,
		chunk: chunk,
		flipped: !!defending,
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
	let anim = hp.anim
	let image = hp.image

	let origin = "topright"
	let start = 0
	let goal = screen.camera.width / 2 - 10
	if (hp.flipped) {
		origin = "topleft"
		start = screen.camera.width
		goal = screen.camera.width / 2 + 10
	}

	let x = anim ? lerp(start, goal, anim.x) : goal
	let y = screen.camera.height - Config.forecastOffset
	nodes.push({
		layer: "ui",
		image, x, y, origin
	})

	if (hp.chunk) {
		let d = screen.time % 60 / 60
		let opacity = (Math.sin(2 * Math.PI * d) + 1) / 2 * 0.5
		screen.dirty = true
		nodes.push({
			layer: "ui",
			image: hp.chunk,
			x, y, origin, opacity
		})
	}

	return nodes
}
