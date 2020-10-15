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

	let src = 1
	let dest = 0
	let duration = exitDuration
	if (vs.anim) {
		({ src, dest, duration } = earlyExit(0, 1, exitDuration, vs.anim.x))
	}
	vs.anim = EaseLinear.create(duration, { src, dest })
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
		width *= lerp(anim.data.src, anim.data.dest, anim.x)
	}
	return [ {
		layer: "ui",
		origin: "center",
		image, x, y, width
	} ]
}
