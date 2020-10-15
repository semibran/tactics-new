import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"

export function create(sprites) {
	return {
		id: "Vs",
		anim: EaseOut.create(15),
		image: sprites.vs,
		sprites: sprites,
		exit: false
	}
}

export function exit(vs) {
	vs.exit = true
	vs.anim = EaseLinear.create(5)
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
		width *= 1 - anim.x
	}
	return [ {
		layer: "ui",
		origin: "center",
		image, x, y, width
	} ]
}
