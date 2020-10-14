import renderPreview from "../view/render-preview"
import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import lerp from "lerp"

export function create(unit) {
	return {
		id: "Preview",
		unit: unit,
		anims: [],
		image: null,
		exit: false
	}
}

export function enter(preview, screen) {
	preview.image = renderPreview(preview.unit, screen.view.sprites)
	preview.anims.push(EaseOut.create(10))
}

export function exit(preview, screen) {
	preview.exit = true
	preview.anims.push(EaseLinear.create(5))
}

export function render(preview, screen) {
	const margin = 2
	let anim = preview.anims[0]
	let t = 1
	if (anim) {
		t = !preview.exit ? anim.x : 1 - anim.x
	}
	let image = preview.image
	let x = lerp(-image.width, margin, t)
	let y = screen.camera.height - image.height - margin + 1
	return [ {
		layer: "ui",
		image: image,
		x: x,
		y: y
	} ]
}
