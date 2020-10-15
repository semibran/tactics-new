import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import earlyExit from "../helpers/early-exit"
import lerp from "lerp"

const enterDuration = 15
const exitDuration = 7

export function create(sprites) {
	return {
		id: "Vs",
		anim: EaseOut.create(enterDuration),
		image: sprites.vs,
		sprites: sprites,
		exit: false
	}
}

export function exit(vs) {
	vs.exit = true

	if (vs.anim) {
		let { src, dest, duration } = earlyExit(0, 1, exitDuration, vs.anim.x)
		vs.anim = EaseLinear.create(duration, { src, dest })
	} else {
		vs.anim = EaseLinear.create(exitDuration)
	}
}

export function render(vs, screen) {
	let anim = vs.anim
	let image = vs.image
	let x = screen.camera.width / 2
	let y = screen.camera.height / 2
	let width = image.width
	if (anim && !vs.exit) {
		width *= anim.x
	} else if (anim && vs.exit) {
		if (anim.data) {
			width *= lerp(anim.data.src, anim.data.dest, anim.x)
		} else {
			width *= (1 - anim.x)
		}
	}
	return [ {
		layer: "ui",
		origin: "center",
		image, x, y, width
	} ]
}
