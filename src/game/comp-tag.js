import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import renderNameTag from "../view/render-name-tag"
import earlyExit from "../helpers/early-exit"
import lerp from "lerp"

const enterDuration = 15
const exitDuration = 7

export function create(name, faction, defending, sprites) {
	return {
		id: "Tag",
		anim: EaseOut.create(enterDuration),
		image: renderNameTag(name, faction, sprites),
		flipped: defending,
		exit: false
	}
}

export function exit(tag) {
	tag.exit = true

	let src = tag.anim ? tag.anim.x : 1
	let duration = tag.anim
		? earlyExit(exitDuration, tag.anim.x)
		: exitDuration
	tag.anim = EaseLinear.create(duration, src, 0)
}

export function render(tag, screen) {
	let anim = tag.anim
	let image = tag.image


	let origin = "right"
	let start = 0
	let goal = screen.camera.width / 2 - 20
	if (tag.flipped) {
		origin = "left"
		start = screen.camera.width
		goal = screen.camera.width / 2 + 20
	}

	let x = anim ? lerp(start, goal, anim.x) : goal
	let y = screen.camera.height / 2
	return [ {
		layer: "ui",
		image, x, y, origin
	} ]
}
