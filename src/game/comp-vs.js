import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import * as Config from "./config"
import earlyExit from "../helpers/early-exit"

const enterDuration = 15
const exitDuration = 7

export function create(sprites) {
	return {
		id: "Vs",
		anim: EaseOut.create(enterDuration),
		image: sprites.vs,
		persist: true,
		blocking: true,
		exit: false
	}
}

export function exit(vs) {
	let src = vs.anim ? vs.anim.x : 1
	let duration = vs.anim
		? earlyExit(exitDuration, vs.anim.x)
		: exitDuration
	vs.anim = EaseLinear.create(duration, { src, dest: 0 })
	vs.exit = true
}

export function render(vs, screen) {
	let anim = vs.anim
	let image = vs.image
	let x = screen.camera.width / 2
	let y = screen.camera.height - Config.forecastOffset
	let width = image.width
	if (anim) {
		width *= anim.x
	}
	return [ {
		layer: "ui",
		origin: "center",
		image, x, y, width
	} ]
}
