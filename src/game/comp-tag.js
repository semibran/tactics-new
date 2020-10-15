import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import * as Config from "./config"
import renderNameTag from "../view/render-name-tag"
import earlyExit from "../helpers/early-exit"
import lerp from "lerp"

const enterDuration = 15
const exitDuration = 7

export function create(name, faction, sprites, defending) {
	return {
		id: "Tag",
		anim: EaseOut.create(enterDuration),
		image: renderNameTag(name, faction, sprites),
		flipped: !!defending,
		persist: true,
		exit: false
	}
}

export function exit(tag) {
	let src = tag.anim ? tag.anim.x : 1
	let duration = tag.anim
		? earlyExit(exitDuration, tag.anim.x)
		: exitDuration
	tag.anim = EaseLinear.create(duration, { src, dest: 0 })
	tag.exit = true
}

export function render(tag, screen) {
	let anim = tag.anim
	let image = tag.image


	let origin = "bottomright"
	let start = 0
	let goal = screen.camera.width / 2 - 20
	if (tag.flipped) {
		origin = "bottomleft"
		start = screen.camera.width
		goal = screen.camera.width / 2 + 20
	}

	let x = anim ? lerp(start, goal, anim.x) : goal
	let y = screen.camera.height - Config.forecastOffset
	return [ {
		layer: "ui",
		image, x, y, origin
	} ]
}
