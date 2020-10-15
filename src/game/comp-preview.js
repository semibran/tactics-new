import renderPreview from "../view/render-preview"
import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import lerp from "lerp"

const margin = 2
const enterDuration = 15
const exitDuration = 5

export function create(unit, sprites) {
	let image = renderPreview(unit, sprites)
	let anim = EaseOut.create(enterDuration, {
		src: -image.width,
		dest: margin
	})
	return {
		id: "Preview",
		anim: null,
		unit: unit,
		image: image,
		exit: false
	}
}

export function exit(preview) {
	preview.exit = true
	let anim = preview.anim
	let src = margin
	let dest = -preview.image.width
	let duration = exitDuration
	if (anim) {
		anim.done = true
		let normdist = anim.data.dest - anim.data.src
		let truedist = anim.x * normdist
		let normspeed = normdist / duration
		duration = truedist / normspeed
		src = anim.data.src + truedist
	}
	preview.anim = EaseLinear.create(duration, { src, dest })
}

export function render(preview, screen) {
	let anim = preview.anim
	let image = preview.image
	let x = anim ? lerp(anim.data.src, anim.data.dest, anim.x) : margin
	let y = screen.camera.height - image.height - margin + 1
	return [ {
		layer: "ui",
		image: image,
		x: x,
		y: y
	} ]
}
