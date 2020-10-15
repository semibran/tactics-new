import renderPreview from "../view/render-preview"
import * as EaseOut from "../anims/ease-out"
import * as EaseLinear from "../anims/ease-linear"
import lerp from "lerp"

const margin = 2
const enterDuration = 15
const exitDuration = 5
const corners = [ "bottomleft", "bottomright", "topleft", "topright" ]

export function create(unit, corner, sprites) {
	if (!corners.includes(corner)) {
		throw new Error(`Failed to create preview component: ${corner} is not a valid corner identifier`)
	}
	let image = renderPreview(unit, sprites)
	let endpts = { src: -image.width, dest: margin }
	let anim = EaseOut.create(enterDuration, endpts)
	return {
		id: "Preview",
		anim: anim,
		unit: unit,
		corner: corner,
		image: image,
		exit: false,
		renders: 0
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

export function onresize(preview, viewport) {
	if (viewport.width >= 160) {
		if (preview.corner === "topright") {
			preview.corner = "bottomright"
		}
	} else {
		if (preview.corner === "bottomright") {
			preview.corner = "topright"
		}
	}
} 

export function render(preview, screen) {
	let anim = preview.anim
	let image = preview.image
	let x = 0
	if (!preview.renders) {
		onresize(preview, screen.camera)
	}
	preview.renders++
	if (preview.corner.endsWith("left")) {
		if (anim) {
			x += lerp(anim.data.src, anim.data.dest, anim.x)
		} else {
			x += margin
		}
	} else if (preview.corner.endsWith("right")) {
		x = screen.camera.width - preview.image.width
		if (anim) {
			x -= lerp(anim.data.src, anim.data.dest, anim.x)
		} else {
			x -= margin
		}
	}
	let y = margin
	if (preview.corner.startsWith("bottom")) {
		y = screen.camera.height - image.height - margin + 1
	}
	return [ {
		layer: "ui",
		image: image,
		x: x,
		y: y
	} ]
}
